import { queryOptions } from '@tanstack/react-query';
import { getSession } from '@/features/auth/auth.functions';

export const authKeys = {
  all: ['auth'] as const,
  session: () => [...authKeys.all, 'session'] as const,
};

export const authQueries = {
  session: () =>
    queryOptions({
      queryKey: authKeys.session(),
      queryFn: () => getSession(),
      staleTime: 0,
    }),
};
