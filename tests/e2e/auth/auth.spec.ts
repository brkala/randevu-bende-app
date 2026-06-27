import { expect, test } from '../lib/fixtures';

test.describe('Authentication Feature', () => {
  test('should handle phone OTP authentication flow', async ({ page, db, waitForHydration }) => {
    const magicCode = process.env.WHATSAPP_MAGIC_CODE || '000000';
    const fakePhoneNumber = '5554443322';

    try {
      await page.goto('/login');
      await waitForHydration();

      // Fill phone via PinInput (10 individual inputs — focus first and type)
      const phoneInput = page.getByTestId('auth-phone-input');
      await phoneInput.getByRole('textbox').first().focus();
      await page.keyboard.type(fakePhoneNumber, { delay: 5 });

      await page.getByTestId('auth-submit-button').click();

      await expect(page.getByTestId('auth-otp-input')).toBeVisible();

      // Fill wrong OTP
      const otpInput = page.getByTestId('auth-otp-input');
      await otpInput.getByRole('textbox').first().focus();
      await page.keyboard.type('999999', { delay: 5 });

      await page.getByTestId('auth-submit-button').click();

      await expect(page.getByTestId('auth-error')).toBeVisible();

      // Fill correct OTP
      await page.getByTestId('auth-otp-input').getByRole('textbox').first().focus();
      await page.keyboard.type(magicCode, { delay: 5 });

      await page.getByTestId('auth-submit-button').click();

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
