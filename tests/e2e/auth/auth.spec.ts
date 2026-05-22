import { expect, test } from '../lib/fixtures';

test.describe('Authentication Feature', () => {
  test('should handle phone OTP authentication flow', async ({ page, db, waitForHydration }) => {
    const magicCode = process.env.WHATSAPP_MAGIC_CODE || '000000';
    const fakePhoneNumber = '5554443322';

    try {
      await page.goto('/login');
      await waitForHydration();

      await page.getByTestId('auth-phone-input').fill(fakePhoneNumber);
      await page.getByTestId('auth-send-otp-button').click();

      await expect(page.getByTestId('auth-otp-input')).toBeVisible();

      await page.getByTestId('auth-otp-input').fill('999999');
      await page.getByTestId('auth-verify-otp-button').click();

      await expect(page.getByTestId('auth-error')).toBeVisible();

      await page.getByTestId('auth-otp-input').fill(magicCode);
      await page.getByTestId('auth-verify-otp-button').click();

      await page.waitForURL('/profile');
      await expect(page.getByTestId('profile-phone-text')).toContainText(fakePhoneNumber);

      await page.getByTestId('profile-logout-button').click();
      await page.waitForURL('/');
    } finally {
      await db.user.deleteMany({
        where: {
          phoneNumber: fakePhoneNumber,
        },
      });
    }
  });
});
