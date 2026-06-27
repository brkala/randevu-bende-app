import { expect, test } from '../lib/fixtures';

const MAGIC = process.env.WHATSAPP_MAGIC_CODE || '000000';

test.describe('Shop Creation & Invitation', () => {
  test('owner creates shop, invites employee by phone, then employee accepts', async ({
    page,
    db,
    waitForHydration,
  }) => {
    const OWNER_PHONE = '5551112201';
    const EMPLOYEE_PHONE = '5551112202';

    // ── PHASE 1: Owner logs in ──────────────────────────────────
    await page.goto('/login');
    await waitForHydration();

    await page.getByTestId('auth-phone-input').fill(OWNER_PHONE);
    await page.getByTestId('auth-send-otp-button').click();
    await expect(page.getByTestId('auth-otp-input')).toBeVisible();

    await page.getByTestId('auth-otp-input').fill(MAGIC);
    await page.getByTestId('auth-verify-otp-button').click();
    await page.waitForURL('/profile');

    // ── PHASE 2: Create shop from profile menu ──────────────────
    await page.getByTestId('profile-menu-trigger').click();

    // Click "Dükkan Oluştur" — the CreateShopDialog trigger is inside a MenuItem
    await page.getByRole('button', { name: /Dükkan Oluştur/i }).click();

    await page.getByTestId('shop-create-name-input').fill('Test Berber');
    await page.getByTestId('shop-create-submit').click();

    // Should land on the owner panel
    await page.waitForURL(/\/shops\//);
    await expect(page.getByTestId('owner-dashboard-shop-title')).toHaveText('Test Berber');

    // ── PHASE 3: Navigate to Employees tab ───────────────────────
    await page.getByTestId('owner-tab-employees').click();

    await expect(page.getByTestId('employees-listbox')).toBeVisible();

    // ── PHASE 4: Open invite dialog, enter phone ─────────────────
    await page.getByTestId('invite-employee-button').click();

    // PinInput has 10 individual inputs; keyboard.type fills them sequentially
    const pinRoot = page.getByTestId('invite-phone-pin-input');
    await pinRoot.getByRole('textbox').first().focus();
    await page.keyboard.type(EMPLOYEE_PHONE, { delay: 10 });

    await page.getByTestId('invite-submit').click();

    // Dialog should close on success
    await expect(pinRoot).not.toBeVisible({ timeout: 5000 });

    // Verify invitation record in DB
    const invitation = await db.shopInvitation.findFirst({
      where: { phone: EMPLOYEE_PHONE, status: 'pending' },
    });
    expect(invitation).not.toBeNull();

    // ── PHASE 5: Logout owner ────────────────────────────────────
    await page.getByTestId('profile-menu-trigger').click();
    await page.getByRole('menuitem', { name: /Çıkış Yap/i }).click();
    await page.waitForURL('/');

    // ── PHASE 6: Login as invited employee ───────────────────────
    await page.goto('/login');
    await waitForHydration();

    await page.getByTestId('auth-phone-input').fill(EMPLOYEE_PHONE);
    await page.getByTestId('auth-send-otp-button').click();
    await expect(page.getByTestId('auth-otp-input')).toBeVisible();
    await page.getByTestId('auth-otp-input').fill(MAGIC);
    await page.getByTestId('auth-verify-otp-button').click();
    await page.waitForURL('/profile');

    // ── PHASE 7: Check "Davetlerim" and accept ───────────────────
    await page.getByTestId('profile-menu-trigger').click();
    await expect(page.getByTestId('invitations-submenu-trigger')).toBeVisible();
    await expect(page.getByTestId('invitation-badge')).toHaveText('1');

    // Hover to open submenu
    await page.getByTestId('invitations-submenu-trigger').hover();
    await page.getByTestId('invitation-accept-button').click();

    // Accept dialog
    await page.getByTestId('accept-display-name-input').fill('Ali Usta');
    await page.getByTestId('accept-submit').click();

    // Verify StaffProfile created in DB
    const profile = await db.staffProfile.findFirst({
      where: { displayName: 'Ali Usta' },
    });
    expect(profile).not.toBeNull();

    // ── PHASE 8: Navigate to employee dashboard ──────────────────
    // Close menu first
    await page.keyboard.press('Escape');
    await page.getByTestId('profile-menu-trigger').click();

    // Shop menu item should be visible now
    await page.getByRole('menuitem', { name: /Test Berber/i }).click();
    await page.waitForURL(/\/shops\//);

    await expect(page.getByTestId('employee-dashboard-shop-title')).toHaveText('Test Berber');
  });

  test('duplicate invite is rejected with error message', async ({
    page,
    db: _db,
    waitForHydration,
  }) => {
    const OWNER_PHONE = '5551112203';
    const EMPLOYEE_PHONE = '5551112204';

    // Owner login
    await page.goto('/login');
    await waitForHydration();
    await page.getByTestId('auth-phone-input').fill(OWNER_PHONE);
    await page.getByTestId('auth-send-otp-button').click();
    await page.getByTestId('auth-otp-input').fill(MAGIC);
    await page.getByTestId('auth-verify-otp-button').click();
    await page.waitForURL('/profile');

    // Create shop
    await page.getByTestId('profile-menu-trigger').click();
    await page.getByRole('button', { name: /Dükkan Oluştur/i }).click();
    await page.getByTestId('shop-create-name-input').fill('Dup Test');
    await page.getByTestId('shop-create-submit').click();
    await page.waitForURL(/\/shops\//);

    // Go to employees
    await page.getByTestId('owner-tab-employees').click();

    // First invite — should succeed
    await page.getByTestId('invite-employee-button').click();
    const pinRoot1 = page.getByTestId('invite-phone-pin-input');
    await pinRoot1.getByRole('textbox').first().focus();
    await page.keyboard.type(EMPLOYEE_PHONE, { delay: 5 });
    await page.getByTestId('invite-submit').click();
    await expect(pinRoot1).not.toBeVisible({ timeout: 5000 });

    // Second invite with same phone — should show error
    await page.getByTestId('invite-employee-button').click();
    const pinRoot2 = page.getByTestId('invite-phone-pin-input');
    await pinRoot2.getByRole('textbox').first().focus();
    await page.keyboard.type(EMPLOYEE_PHONE, { delay: 5 });
    await page.getByTestId('invite-submit').click();

    // Error should be visible (PinInput doesn't close on error)
    await expect(page.getByText(/zaten bekleyen bir davet var/i)).toBeVisible({ timeout: 5000 });
  });
});
