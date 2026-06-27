import { Link, useRouteContext } from '@tanstack/react-router';
import { Button } from '@/features/shared/components/ui/button';

export function LandingPage() {
  const { auth } = useRouteContext({ from: '__root__' });
  const isLoggedIn = !!auth?.user;

  return (
    <main className="max-w-4xl mx-auto p-6 text-center">
      <h1 className="text-3xl font-bold mt-12 mb-4">Randevu Bende</h1>
      <p className="text-lg text-fg-muted mb-8 max-w-xl mx-auto">
        Kuaför, berber ve güzellik salonları için modern randevu yönetim sistemi.
      </p>

      {isLoggedIn ? (
        <div className="flex flex-col items-center gap-4">
          <p className="text-fg-subtle">
            Hoş geldiniz, {auth?.user?.name || auth?.user?.email?.split('@')[0]}!
          </p>
          <Button variant="accent" size="md" asChild>
            <Link to="/profile">Paneli Görüntüle</Link>
          </Button>
        </div>
      ) : (
        <Button variant="accent" size="md" asChild>
          <Link to="/login">Giriş Yap</Link>
        </Button>
      )}
    </main>
  );
}
