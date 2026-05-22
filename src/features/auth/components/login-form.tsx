import { useRouter } from '@tanstack/react-router';
import { useState } from 'react';
import { authClient } from '@/features/auth/auth.client';

export function LoginForm() {
  const router = useRouter();
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await authClient.phoneNumber.sendOtp({
        phoneNumber,
      });
      if (res?.error) {
        setError(res.error.message || 'Bir hata oluştu');
      } else {
        setStep('otp');
      }
    } catch (_err) {
      setError('Bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await authClient.phoneNumber.verify({
        phoneNumber,
        code,
      });
      if (res?.error) {
        setError(res.error.message || 'Bir hata oluştu');
      } else {
        router.navigate({ to: '/profile' });
      }
    } catch (_err) {
      setError('Bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Giriş Yap / Kayıt Ol</h2>
      {!!error && (
        <div style={{ color: 'red' }} data-testid="auth-error">
          {error}
        </div>
      )}

      {step === 'phone' && (
        <form onSubmit={handleSendOtp}>
          <div>
            <label htmlFor="phone">Telefon Numarası:</label>
            <input
              id="phone"
              type="text"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="Örn: 5551234567"
              required
              data-testid="auth-phone-input"
            />
          </div>
          <button type="submit" disabled={loading} data-testid="auth-send-otp-button">
            {loading ? 'Gönderiliyor...' : 'OTP Gönder'}
          </button>
        </form>
      )}

      {step === 'otp' && (
        <form onSubmit={handleVerifyOtp}>
          <div>
            <label htmlFor="code">Onay Kodu (OTP):</label>
            <input
              id="code"
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="111222"
              required
              data-testid="auth-otp-input"
            />
          </div>
          <button type="submit" disabled={loading} data-testid="auth-verify-otp-button">
            {loading ? 'Doğrulanıyor...' : 'Doğrula ve Giriş Yap'}
          </button>
        </form>
      )}
    </div>
  );
}
