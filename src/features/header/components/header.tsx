import { Link, useRouteContext } from '@tanstack/react-router';
import { Calendar } from 'lucide-react';
import { ProfileMenu } from '@/features/header/components/profile-menu';
import { Button } from '@/features/shared/components/ui/button';

export function Header() {
  const { auth } = useRouteContext({ from: '__root__' });
  const user = auth?.user ?? null;

  return (
    <header className="flex items-center justify-between px-6 py-3 border-b border-border-default bg-bg-default">
      <Link to="/" className="flex items-center gap-2 no-underline text-fg-default">
        <Calendar size={24} className="text-accent-default" />
        <span className="text-lg font-semibold">Randevu Bende</span>
      </Link>

      <nav className="flex items-center gap-3">
        {user ? (
          <ProfileMenu />
        ) : (
          <Button variant="accent" size="sm" asChild>
            <Link to="/login">Giriş Yap</Link>
          </Button>
        )}
      </nav>
    </header>
  );
}
