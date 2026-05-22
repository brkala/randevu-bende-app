import { createFileRoute, redirect } from '@tanstack/react-router';
import { LoginForm } from '@/features/auth/components/login-form';

export const Route = createFileRoute('/login')({
  beforeLoad: ({ context }) => {
    if (context.auth?.user) {
      throw redirect({ to: '/profile' });
    }
  },
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <main>
      <LoginForm />
    </main>
  );
}
