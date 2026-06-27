import { createServerFn } from '@tanstack/react-start';

export const getSession = createServerFn({ method: 'GET' }).handler(async () => {
  const { getRequest } = await import('@tanstack/react-start/server');
  const { auth } = await import('@/features/auth/auth.server');
  const { prisma } = await import('@/features/database/lib/client.server');
  const request = getRequest();

  const session = await auth.api.getSession({
    headers: request?.headers,
    query: { disableCookieCache: true as any },
  });

  if (!session) return null;

  // Augment with fresh membership/organization data from Prisma
  // better-auth's session cache may be stale after org creation
  const userMembers = await prisma.member.findMany({
    where: { userId: session.user.id },
    include: { organization: { select: { id: true, name: true, slug: true } } },
  });

  return {
    ...session,
    memberships: userMembers.map((m) => ({
      organizationId: m.organizationId,
      role: m.role,
      organization: m.organization,
    })),
    organizations: userMembers.map((m) => m.organization),
  };
});
