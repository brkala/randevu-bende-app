import { expect, test } from '../lib/fixtures';

test.describe('Authentication Feature', () => {
  test('should handle phone OTP authentication flow', async ({ page, db, waitForHydration }) => {
    const magicCode = process.env.WHATSAPP_MAGIC_CODE || '000000';
    const fakePhoneNumber = '5554443322';

    try {
      await page.goto('/login');
      await waitForHydration();

      // Fill phone via PinInput using ARIA labels ("pin code 1 of 10")
      await page.getByRole('textbox', { name: 'pin code 1 of 10' }).focus();
      await page.keyboard.type(fakePhoneNumber, { delay: 5 });

      await page.getByRole('button', { name: 'OTP Gönder' }).click();

      await expect(page.getByRole('textbox', { name: 'pin code 1 of 6' })).toBeVisible();

      // Fill wrong OTP
      await page.getByRole('textbox', { name: 'pin code 1 of 6' }).focus();
      await page.keyboard.type('999999', { delay: 5 });

      await page.getByRole('button', { name: 'Doğrula ve Giriş Yap' }).click();

      await expect(page.getByTestId('auth-error')).toBeVisible();

      // Fill correct OTP
      await page.getByRole('textbox', { name: 'pin code 1 of 6' }).focus();
      await page.keyboard.type(magicCode, { delay: 5 });

      await page.getByRole('button', { name: 'Doğrula ve Giriş Yap' }).click();

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
