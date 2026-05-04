import type { QueryClient } from '@tanstack/react-query';
import { createRootRouteWithContext, HeadContent, Outlet, Scripts } from '@tanstack/react-router';
import type { ReactNode } from 'react';

interface MyRouterContext {
  queryClient: QueryClient;
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  head: () => ({
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      {
        title: 'Randevu Bende - TanStack Start',
      },
    ],
  }),
  component: RootComponent,
  notFoundComponent: () => <div>Sayfa Bulunamadı (404)</div>,
});

import { QueryClientProvider } from '@tanstack/react-query';

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <RootDocument>
        <Outlet />
      </RootDocument>
    </QueryClientProvider>
  );
}

import { useEffect } from 'react';

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
        {children}
        <Scripts />
      </body>
    </html>
  );
}
