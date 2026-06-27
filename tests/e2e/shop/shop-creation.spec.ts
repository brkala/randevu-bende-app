import { expect, test } from '../lib/fixtures';

const MAGIC = process.env.WHATSAPP_MAGIC_CODE || '000000';

test.describe('Shop Creation & Invitation', () => {
  test('owner creates shop, invites employee by phone, then employee accepts', async ({
    page,
    db,
    waitForHydration,
  }) => {
    const OWNER_PHONE = '5551112221';
    const EMPLOYEE_PHONE = '5551112222';

    // ── PHASE 1: Owner logs in ──────────────────────────────────
    await page.goto('/login');
    await waitForHydration();

    await page.getByRole('textbox', { name: 'pin code 1 of 10' }).focus();
    await page.keyboard.type(OWNER_PHONE, { delay: 5 });
    await page.getByRole('button', { name: 'OTP Gönder' }).click();

    await expect(page.getByRole('textbox', { name: 'pin code 1 of 6' })).toBeVisible();
    await page.getByRole('textbox', { name: 'pin code 1 of 6' }).focus();
    await page.keyboard.type(MAGIC, { delay: 5 });
    await page.getByRole('button', { name: 'Doğrula ve Giriş Yap' }).click();

    await page.waitForURL('/profile');

    // ── PHASE 2: Create shop from profile menu ──────────────────
    await page.getByTestId('profile-menu-trigger').click();
    await page.getByRole('button', { name: /Dükkan Oluştur/i }).click();

    await page.getByTestId('shop-create-name-input').fill('Test Berber');
    await page.getByTestId('shop-create-submit').click();

    // Client-side navigation may redirect to / if session is stale.
    // Use full page navigation to force fresh session load.
    await page.waitForTimeout(500);
    const org = await db.organization.findFirst({
      where: { name: 'Test Berber' },
      orderBy: { createdAt: 'desc' },
    });
    expect(org).not.toBeNull();

    await page.goto(`/shops/${org!.id}`, { waitUntil: 'domcontentloaded' });
    await waitForHydration();

    await expect(page).not.toHaveURL('/');
    await expect(page).toHaveURL(/\/shops\//);
    await expect(page.getByTestId('owner-dashboard-shop-title')).toHaveText('Test Berber');

    // ── PHASE 3: Navigate to Employees tab ───────────────────────
    await page.getByTestId('owner-tab-employees').click();
    await expect(page.getByTestId('employees-listbox')).toBeVisible();

    // ── PHASE 4: Invite employee by phone ────────────────────────
    await page.getByTestId('invite-employee-button').click();

    await page.getByRole('textbox', { name: 'pin code 1 of 10' }).focus();
    await page.keyboard.type(EMPLOYEE_PHONE, { delay: 5 });
    await page.getByTestId('invite-submit').click();

    await expect(page.getByTestId('invite-submit')).not.toBeVisible({ timeout: 5000 });

    // Verify invitation in DB
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

    await page.getByRole('textbox', { name: 'pin code 1 of 10' }).focus();
    await page.keyboard.type(EMPLOYEE_PHONE, { delay: 5 });
    await page.getByRole('button', { name: 'OTP Gönder' }).click();

    await expect(page.getByRole('textbox', { name: 'pin code 1 of 6' })).toBeVisible();
    await page.getByRole('textbox', { name: 'pin code 1 of 6' }).focus();
    await page.keyboard.type(MAGIC, { delay: 5 });
    await page.getByRole('button', { name: 'Doğrula ve Giriş Yap' }).click();

    await page.waitForURL('/profile');

    // ── PHASE 7: Accept invitation ───────────────────────────────
    await page.getByTestId('profile-menu-trigger').click();
    await expect(page.getByTestId('invitations-submenu-trigger')).toBeVisible();
    await expect(page.getByTestId('invitation-badge')).toHaveText('1');

    await page.getByTestId('invitations-submenu-trigger').hover();
    await page.getByTestId('invitation-accept-button').click();

    await page.getByTestId('accept-display-name-input').fill('Ali Usta');
    await page.getByTestId('accept-submit').click();

    // Verify StaffProfile in DB
    const profile = await db.staffProfile.findFirst({
      where: { displayName: 'Ali Usta' },
    });
    expect(profile).not.toBeNull();

    // ── PHASE 8: Navigate to employee dashboard ──────────────────
    await page.keyboard.press('Escape');
    await page.goto(`/shops/${org!.id}`, { waitUntil: 'domcontentloaded' });
    await waitForHydration();

    await expect(page.getByTestId('employee-dashboard-shop-title')).toHaveText('Test Berber');
  });

  test('duplicate invite is rejected with error message', async ({
    page,
    db,
    waitForHydration,
  }) => {
    const OWNER_PHONE = '5551112223';
    const EMPLOYEE_PHONE = '5551112224';

    // Login
    await page.goto('/login');
    await waitForHydration();

    await page.getByRole('textbox', { name: 'pin code 1 of 10' }).focus();
    await page.keyboard.type(OWNER_PHONE, { delay: 5 });
    await page.getByRole('button', { name: 'OTP Gönder' }).click();

    await expect(page.getByRole('textbox', { name: 'pin code 1 of 6' })).toBeVisible();
    await page.getByRole('textbox', { name: 'pin code 1 of 6' }).focus();
    await page.keyboard.type(MAGIC, { delay: 5 });
    await page.getByRole('button', { name: 'Doğrula ve Giriş Yap' }).click();

    await page.waitForURL('/profile');

    // Create shop
    await page.getByTestId('profile-menu-trigger').click();
    await page.getByRole('button', { name: /Dükkan Oluştur/i }).click();
    await page.getByTestId('shop-create-name-input').fill('Dup Test');
    await page.getByTestId('shop-create-submit').click();

    await page.waitForTimeout(500);
    const org = await db.organization.findFirst({
      where: { name: 'Dup Test' },
      orderBy: { createdAt: 'desc' },
    });
    expect(org).not.toBeNull();

    // Navigate to shop owner panel
    await page.goto(`/shops/${org!.id}`, { waitUntil: 'domcontentloaded' });
    await waitForHydration();

    await expect(page.getByTestId('owner-tab-employees')).toBeVisible();
    await page.getByTestId('owner-tab-employees').click();

    // First invite — should succeed
    await page.getByTestId('invite-employee-button').click();
    await page.getByRole('textbox', { name: 'pin code 1 of 10' }).focus();
    await page.keyboard.type(EMPLOYEE_PHONE, { delay: 5 });
    await page.getByTestId('invite-submit').click();

    await expect(page.getByTestId('invite-submit')).not.toBeVisible({ timeout: 5000 });

    // Second invite with same phone — should show error
    await page.getByTestId('invite-employee-button').click();
    await page.getByRole('textbox', { name: 'pin code 1 of 10' }).focus();
    await page.keyboard.type(EMPLOYEE_PHONE, { delay: 5 });
    await page.getByTestId('invite-submit').click();

    await expect(page.getByText(/zaten bekleyen bir davet var/i)).toBeVisible({ timeout: 5000 });
  });
});
