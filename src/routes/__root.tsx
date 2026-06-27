import type { QueryClient } from '@tanstack/react-query';
import { createRootRouteWithContext, HeadContent, Outlet, Scripts } from '@tanstack/react-router';
import type { ReactNode } from 'react';
import { getSession } from '@/features/auth/auth.functions';
import { Header } from '@/features/header/components/header';
import '@/features/style/styles/global.css';

interface MyRouterContext {
  queryClient: QueryClient;
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  beforeLoad: async () => {
    const authSession = await getSession();
    return { auth: authSession };
  },
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { title: 'Randevu Bende - TanStack Start' },
    ],
    links: [
      { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
      { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossOrigin: 'anonymous' },
      {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&family=JetBrains+Mono:ital,wght@0,100..800;1,100..800&family=Playfair+Display:ital,wght@0,400..900;1,400..900&display=swap',
      },
    ],
  }),
  component: RootComponent,
  notFoundComponent: () => <div>Sayfa Bulunamadı (404)</div>,
});

import { Toaster } from '@ark-ui/react/toast';
import { QueryClientProvider } from '@tanstack/react-query';
import { useEffect } from 'react';
import {
  ToastCloseTrigger,
  ToastDescription,
  ToastRoot,
  ToastTitle,
} from '@/features/shared/components/ui/toast';
import { toaster } from '@/features/shared/lib/toaster';
import { LucideProvider } from '@/features/style/components/lucide-provider';

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <LucideProvider>
        <RootDocument>
          <Outlet />
        </RootDocument>
      </LucideProvider>
    </QueryClientProvider>
  );
}

function RootDocument({ children }: Readonly<{ children: ReactNode }>) {
  useEffect(() => {
    if (import.meta.env.DEV) {
      document.body.dataset.hydrated = 'true';
    }
  }, []);

  return (
    <html lang="tr">
      <head>
        <HeadContent />
      </head>
      <body>
        <Header />
        {children}
        <Toaster toaster={toaster}>
          {(toast) => (
            <ToastRoot key={toast.id}>
              <ToastTitle>{toast.title}</ToastTitle>
              {toast.description ? <ToastDescription>{toast.description}</ToastDescription> : null}
              <ToastCloseTrigger />
            </ToastRoot>
          )}
        </Toaster>
        <Scripts />
      </body>
    </html>
  );
}
