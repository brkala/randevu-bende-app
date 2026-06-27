import { createServerFn } from '@tanstack/react-start';

export const getSession = createServerFn({ method: 'GET' }).handler(async () => {
  const { getRequest } = await import('@tanstack/react-start/server');
  const { auth } = await import('@/features/auth/auth.server');
  const request = getRequest();
  return auth.api.getSession({ headers: request?.headers });
});
