import { expect, test } from '../lib/fixtures';

const MAGIC = process.env.WHATSAPP_MAGIC_CODE || '000000';

test.describe('Shop Creation & Invitation', () => {
  test('owner creates shop, invites employee by phone, then employee accepts', async ({
    page,
    db,
    waitForHydration,
  }) => {
    const OWNER_PHONE = '5551112241';
    const EMPLOYEE_PHONE = '5551112242';

    // ── Helper: login ────────────────────────────────────────
    const doLogin = async (phone: string) => {
      await page.goto('/login');
      await waitForHydration();
      await page.getByRole('textbox', { name: 'pin code 1 of 10' }).focus();
      await page.keyboard.type(phone, { delay: 5 });
      await page.getByRole('button', { name: 'OTP Gönder' }).click();
      await expect(page.getByRole('textbox', { name: 'pin code 1 of 6' })).toBeVisible();
      await page.getByRole('textbox', { name: 'pin code 1 of 6' }).focus();
      await page.keyboard.type(MAGIC, { delay: 5 });
      await page.getByRole('button', { name: 'Doğrula ve Giriş Yap' }).click();
      await page.waitForURL('/profile');
    };

    // ── Owner creates shop ──────────────────────────────────
    await doLogin(OWNER_PHONE);

    await page.getByTestId('profile-menu-trigger').click();
    await page.getByRole('button', { name: /Dükkan Oluştur/i }).click();
    await page.getByTestId('shop-create-name-input').fill('Test Berber');
    await page.getByTestId('shop-create-submit').click();

    await page.waitForTimeout(500);
    const org = await db.organization.findFirst({
      where: { name: 'Test Berber' },
      orderBy: { createdAt: 'desc' },
    });
    expect(org).not.toBeNull();
    const orgId = org!.id;

    // Re-login to get fresh session with the new membership
    await page.getByTestId('profile-menu-trigger').click();
    await page.getByRole('menuitem', { name: /Çıkış Yap/i }).click();
    await page.waitForURL('/');
    await doLogin(OWNER_PHONE);

    // Navigate to owner panel
    await page.goto(`/shops/${orgId}`, { waitUntil: 'domcontentloaded' });
    await waitForHydration();
    await expect(page).not.toHaveURL('/');
    await expect(page.getByTestId('owner-dashboard-shop-title')).toHaveText('Test Berber');

    // ── Navigate to Employees, invite ───────────────────────
    await page.getByTestId('owner-tab-employees').click();
    await expect(page.getByTestId('employees-listbox')).toBeVisible();

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

    // ── Employee accepts invitation ─────────────────────────
    await page.getByTestId('profile-menu-trigger').click();
    await page.getByRole('menuitem', { name: /Çıkış Yap/i }).click();
    await page.waitForURL('/');
    await doLogin(EMPLOYEE_PHONE);

    // Check invitations
    await page.getByTestId('profile-menu-trigger').click();
    await expect(page.getByTestId('invitations-submenu-trigger')).toBeVisible();
    await expect(page.getByTestId('invitation-badge')).toHaveText('1');
    await page.getByTestId('invitations-submenu-trigger').hover();
    await page.getByTestId('invitation-accept-button').click();

    await page.getByTestId('accept-display-name-input').fill('Ali Usta');
    await page.getByTestId('accept-submit').click();

    const profile = await db.staffProfile.findFirst({
      where: { displayName: 'Ali Usta' },
    });
    expect(profile).not.toBeNull();

    // ── Employee dashboard ──────────────────────────────────
    await page.keyboard.press('Escape');
    await page.getByTestId('profile-menu-trigger').click();
    await page.getByRole('menuitem', { name: /Çıkış Yap/i }).click();
    await page.waitForURL('/');
    await doLogin(EMPLOYEE_PHONE);

    await page.goto(`/shops/${orgId}`, { waitUntil: 'domcontentloaded' });
    await waitForHydration();
    await expect(page.getByTestId('employee-dashboard-shop-title')).toHaveText('Test Berber');
  });

  test('duplicate invite is rejected with error message', async ({
    page,
    db,
    waitForHydration,
  }) => {
    const OWNER_PHONE = '5551112243';
    const EMPLOYEE_PHONE = '5551112244';

    const doLogin = async (phone: string) => {
      await page.goto('/login');
      await waitForHydration();
      await page.getByRole('textbox', { name: 'pin code 1 of 10' }).focus();
      await page.keyboard.type(phone, { delay: 5 });
      await page.getByRole('button', { name: 'OTP Gönder' }).click();
      await expect(page.getByRole('textbox', { name: 'pin code 1 of 6' })).toBeVisible();
      await page.getByRole('textbox', { name: 'pin code 1 of 6' }).focus();
      await page.keyboard.type(MAGIC, { delay: 5 });
      await page.getByRole('button', { name: 'Doğrula ve Giriş Yap' }).click();
      await page.waitForURL('/profile');
    };

    await doLogin(OWNER_PHONE);

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
    const orgId = org!.id;

    // Re-login for fresh session
    await page.getByTestId('profile-menu-trigger').click();
    await page.getByRole('menuitem', { name: /Çıkış Yap/i }).click();
    await page.waitForURL('/');
    await doLogin(OWNER_PHONE);

    // Go to owner panel
    await page.goto(`/shops/${orgId}`, { waitUntil: 'domcontentloaded' });
    await waitForHydration();
    await expect(page.getByTestId('owner-tab-employees')).toBeVisible();
    await page.getByTestId('owner-tab-employees').click();

    // First invite — succeed
    await page.getByTestId('invite-employee-button').click();
    await page.getByRole('textbox', { name: 'pin code 1 of 10' }).focus();
    await page.keyboard.type(EMPLOYEE_PHONE, { delay: 5 });
    await page.getByTestId('invite-submit').click();
    await expect(page.getByTestId('invite-submit')).not.toBeVisible({ timeout: 5000 });

    // Second invite — error
    await page.getByTestId('invite-employee-button').click();
    await page.getByRole('textbox', { name: 'pin code 1 of 10' }).focus();
    await page.keyboard.type(EMPLOYEE_PHONE, { delay: 5 });
    await page.getByTestId('invite-submit').click();
    await expect(page.getByText(/zaten bekleyen bir davet var/i)).toBeVisible({ timeout: 5000 });
  });
});
