import { expect, test } from '../lib/fixtures';

const MAGIC = process.env.WHATSAPP_MAGIC_CODE || '000000';

test.describe('Shop Creation & Invitation', () => {
  test('owner creates shop, invites employee by phone, then employee accepts', async ({
    page,
    waitForHydration,
  }) => {
    const OWNER_PHONE = '5551112281';
    const EMPLOYEE_PHONE = '5551112282';

    const doLogin = async (phone: string) => {
      await page.context().clearCookies();
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

    // Create shop via dialog
    await page.getByTestId('profile-menu-trigger').click();
    await page.getByRole('button', { name: /Dükkan Oluştur/i }).click();
    await expect(page.getByRole('dialog')).toBeVisible();
    await page.getByTestId('shop-create-name-input').fill('Test Berber');
    await page.getByTestId('shop-create-submit').click();

    // createShopFn navigates to /shops/<orgId> on success.
    // Wait for navigation, extract orgId from URL.
    await page.waitForURL(/\/shops\//, { timeout: 10000 });
    const url = new URL(page.url());
    const orgId = url.pathname.split('/')[2];
    expect(orgId).toBeTruthy();

    // Force full reload so _shop layout reads activeOrganizationId from session
    await page.goto(`/shops/${orgId}`, { waitUntil: 'domcontentloaded' });
    await waitForHydration();
    await expect(page.getByTestId('owner-dashboard-shop-title')).toHaveText('Test Berber', {
      timeout: 10000,
    });

    await page.getByTestId('owner-tab-employees').click();
    await expect(page.getByTestId('employees-listbox')).toBeVisible();

    // Invite employee
    await page.getByTestId('invite-employee-button').click();
    await page.getByRole('textbox', { name: 'pin code 1 of 10' }).focus();
    await page.keyboard.type(EMPLOYEE_PHONE, { delay: 5 });
    await page.getByTestId('invite-submit').click();
    await expect(page.getByTestId('invite-submit')).not.toBeVisible({ timeout: 5000 });

    // Employee accepts invitation
    await doLogin(EMPLOYEE_PHONE);
    await page.getByTestId('profile-menu-trigger').click();
    await expect(page.getByTestId('invitations-submenu-trigger')).toBeVisible();
    await expect(page.getByTestId('invitation-badge')).toHaveText('1');
    await page.getByTestId('invitations-submenu-trigger').hover();
    await page.getByTestId('invitation-accept-button').click();
    await page.getByTestId('accept-display-name-input').fill('Ali Usta');
    await page.getByTestId('accept-submit').click();
    await page.waitForTimeout(1000);

    // Employee dashboard — page.goto sends session with activeOrganizationId
    await page.goto(`/shops/${orgId}`, { waitUntil: 'domcontentloaded' });
    await waitForHydration();
    await expect(page.getByTestId('employee-dashboard-shop-title')).toHaveText('Test Berber');
  });

  test('duplicate invite is rejected with error message', async ({ page, waitForHydration }) => {
    const OWNER_PHONE = '5551112283';
    const EMPLOYEE_PHONE = '5551112284';

    const doLogin = async (phone: string) => {
      await page.context().clearCookies();
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
    await page.getByTestId('profile-menu-trigger').click();
    await page.getByRole('button', { name: /Dükkan Oluştur/i }).click();
    await expect(page.getByRole('dialog')).toBeVisible();
    await page.getByTestId('shop-create-name-input').fill('Dup Test');
    await page.getByTestId('shop-create-submit').click();

    await page.waitForURL(/\/shops\//, { timeout: 10000 });
    const url = new URL(page.url());
    const orgId = url.pathname.split('/')[2];
    expect(orgId).toBeTruthy();

    await page.goto(`/shops/${orgId}`, { waitUntil: 'domcontentloaded' });
    await waitForHydration();
    await expect(page.getByTestId('owner-tab-employees')).toBeVisible({ timeout: 10000 });
    await page.getByTestId('owner-tab-employees').click();

    // First invite succeed
    await page.getByTestId('invite-employee-button').click();
    await page.getByRole('textbox', { name: 'pin code 1 of 10' }).focus();
    await page.keyboard.type(EMPLOYEE_PHONE, { delay: 5 });
    await page.getByTestId('invite-submit').click();
    await expect(page.getByTestId('invite-submit')).not.toBeVisible({ timeout: 5000 });

    // Second invite error
    await page.getByTestId('invite-employee-button').click();
    await page.waitForTimeout(800);
    for (let i = 0; i < EMPLOYEE_PHONE.length; i++) {
      const cell = page.getByRole('textbox', { name: `pin code ${i + 1} of 10` });
      await cell.fill('');
      await cell.fill(EMPLOYEE_PHONE[i]);
    }
    await page.waitForTimeout(300);
    await page.getByTestId('invite-submit').click();
    await expect(page.getByText(/zaten bekleyen bir davet var/i)).toBeVisible({ timeout: 5000 });
  });
});
