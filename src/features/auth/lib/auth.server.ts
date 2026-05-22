import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { organization, phoneNumber } from 'better-auth/plugins';
import { prisma } from '@/features/database/lib/client.server';
import { isWhatsAppMagicCode } from '@/features/whatsapp/lib/whatsapp.utils';

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: 'postgresql',
  }),
  plugins: [
    organization(),
    phoneNumber({
      sendOTP: async ({ phoneNumber, code }) => {
        console.log(`[WHATSAPP MOCK] Numara: ${phoneNumber}, OTP Kodu: ${code}`);
        console.log(`Numara: ${phoneNumber}, OTP Kodu: ${code}`);
      },
      signUpOnVerification: {
        getTempEmail: (phone) => `${phone.replace(/\D/g, '')}@randevubende.temp`,
      },
      verifyOTP: async ({ phoneNumber, code }, ctx) => {
        if (isWhatsAppMagicCode(code)) {
          console.log(`Numara: ${phoneNumber}`);
          return true;
        }

        const otp = await ctx?.context.internalAdapter.findVerificationValue(phoneNumber);
        if (!otp || otp.expiresAt < new Date()) return false;

        const [otpValue, attempts] = otp.value.split(':');
        const allowedAttempts = 3;

        if (attempts && parseInt(attempts) >= allowedAttempts) {
          await ctx?.context.internalAdapter.deleteVerificationByIdentifier(phoneNumber);
          return false;
        }

        if (otpValue !== code) {
          await ctx?.context.internalAdapter.updateVerificationByIdentifier(phoneNumber, {
            value: `${otpValue}:${parseInt(attempts || '0') + 1}`,
          });
          return false;
        }

        await ctx?.context.internalAdapter.deleteVerificationByIdentifier(phoneNumber);
        return true;
      },
    }),
  ],
  emailAndPassword: {
    enabled: true,
  },
});
