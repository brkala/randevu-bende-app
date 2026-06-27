import { useRouter } from '@tanstack/react-router';
import { useState } from 'react';
import { useKeyRef } from 'rooks';
import { loginSchema } from '@/features/auth/auth.schemas';
import { authClient } from '@/features/auth/auth-client';
import { useAppForm } from '@/features/form/form';
import { Button } from '@/features/shared/components/ui/button';

export function LoginForm() {
  const router = useRouter();
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [globalError, setGlobalError] = useState<string | null>(null);

  const form = useAppForm({
    defaultValues: {
      phoneNumber: '',
      code: '',
    },
    validators: {
      onBlur: loginSchema,
    },
    onSubmit: async ({ value }) => {
      setGlobalError(null);

      if (step === 'phone') {
        const res = await authClient.phoneNumber.sendOtp({
          phoneNumber: value.phoneNumber,
        });
        if (res?.error) {
          setGlobalError(res.error.message || 'Bir hata oluştu');
        } else {
          setStep('otp');
        }
      } else {
        const res = await authClient.phoneNumber.verify({
          phoneNumber: value.phoneNumber,
          code: value.code,
        });
        if (res?.error) {
          setGlobalError(res.error.message || 'Bir hata oluştu');
        } else {
          router.navigate({ to: '/profile' });
        }
      }
    },
  });

  const submitRef = useKeyRef('Enter', (e) => {
    e.preventDefault();
    form.handleSubmit();
  });

  return (
    <div className="max-w-sm mx-auto mt-12">
      <h1 className="text-2xl font-bold mb-6 text-center">Giriş Yap / Kayıt Ol</h1>

      {globalError ? (
        <div
          className="mb-4 p-3 rounded-lg bg-error-subtle text-error-default text-sm text-center"
          data-testid="auth-error"
        >
          {globalError}
        </div>
      ) : null}

      <form.AppForm>
        <form
          ref={submitRef}
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}
          className="space-y-4"
        >
          <form.AppField name="phoneNumber">
            {(field) => (
              <field.PinInputField
                label="Telefon Numarası"
                count={10}
                size="sm"
                disabled={step === 'otp'}
                data-testid="auth-phone-input"
              />
            )}
          </form.AppField>

          {step === 'otp' ? (
            <form.AppField name="code">
              {(field) => (
                <field.PinInputField
                  label="Onay Kodu (OTP)"
                  count={6}
                  data-testid="auth-otp-input"
                  autoFocus
                />
              )}
            </form.AppField>
          ) : null}

          <form.Subscribe selector={(state) => state.isSubmitting}>
            {(isSubmitting) => (
              <Button
                type="submit"
                variant="accent"
                size="md"
                fullWidth
                disabled={isSubmitting}
                data-testid="auth-submit-button"
              >
                {isSubmitting
                  ? 'Yükleniyor...'
                  : step === 'phone'
                    ? 'OTP Gönder'
                    : 'Doğrula ve Giriş Yap'}
              </Button>
            )}
          </form.Subscribe>
        </form>
      </form.AppForm>
    </div>
  );
}
