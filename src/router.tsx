import { createRouter } from '@tanstack/react-router';
import { createQueryClient } from './features/shared/lib/query-client';
import { routeTree } from './routeTree.gen';

export function getRouter() {
  const queryClient = createQueryClient();

  const router = createRouter({
    routeTree,
    context: {
      queryClient,
      auth: null,
    },
    defaultPreload: 'intent',
    scrollRestoration: true,
  });

  return router;
}

declare module '@tanstack/react-router' {
  interface Register {
    router: ReturnType<typeof getRouter>;
  }
}
