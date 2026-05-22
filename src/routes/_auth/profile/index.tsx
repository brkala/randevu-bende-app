import { createFileRoute, useRouter } from '@tanstack/react-router';
import { signOut } from '@/features/auth/auth.client';

export const Route = createFileRoute('/_auth/profile/')({
  component: RouteComponent,
});

function RouteComponent() {
  const { auth } = Route.useRouteContext();
  const router = useRouter();

  const handleLogout = async () => {
    await signOut();
    router.navigate({ to: '/' });
  };

  return (
    <div>
      <h2>Profil Sayfası</h2>
      <p data-testid="profile-phone-text">
        Kayıtlı Telefon Numaranız: {auth?.user?.phoneNumber || auth?.user?.email}
      </p>

      <button type="button" onClick={handleLogout} data-testid="profile-logout-button">
        Çıkış Yap
      </button>
    </div>
  );
}
