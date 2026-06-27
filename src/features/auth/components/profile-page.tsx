import { useRouteContext, useRouter } from '@tanstack/react-router';
import { signOut } from '@/features/auth/auth-client';
import { Button } from '@/features/shared/components/ui/button';

export function ProfilePage() {
  const { auth } = useRouteContext({ from: '__root__' });
  const router = useRouter();

  const handleLogout = async () => {
    await signOut();
    router.navigate({ to: '/' });
  };

  return (
    <main className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Profilim</h1>

      <div className="bg-bg-default rounded-xl border border-border-default p-6 space-y-4">
        <div>
          <span className="text-sm text-fg-muted">Ad Soyad</span>
          <p className="text-lg font-medium">{auth?.user?.name || '—'}</p>
        </div>

        <div>
          <span className="text-sm text-fg-muted">E-posta</span>
          <p className="text-lg font-medium">{auth?.user?.email || '—'}</p>
        </div>

        <div>
          <span className="text-sm text-fg-muted">Telefon</span>
          <p className="text-lg font-medium" data-testid="profile-phone-text">
            {auth?.user?.phoneNumber || '—'}
          </p>
        </div>
      </div>

      <Button
        variant="error"
        size="md"
        onClick={handleLogout}
        data-testid="profile-logout-button"
        className="mt-6"
      >
        Çıkış Yap
      </Button>
    </main>
  );
}
