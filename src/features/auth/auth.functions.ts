import { createServerFn } from '@tanstack/react-start';
import { getRequest } from '@tanstack/react-start/server';
import { auth } from '@/features/auth/auth.server';
import { prisma } from '@/features/database/lib/client.server';

export const getSession = createServerFn({ method: 'GET' }).handler(async () => {
  const request = getRequest();

  const result = await auth.api.getSession({ headers: request?.headers });
  if (!result) return null;

  // better-auth does NOT include organizations/memberships in getSession.
  // Query via the existing PrismaClient — already used by auth.server.
  const userMembers = await prisma.member.findMany({
    where: { userId: result.user.id },
    include: { organization: { select: { id: true, name: true, slug: true } } },
  });

  return {
    ...result,
    organizations: userMembers.map((m) => m.organization),
    memberships: userMembers.map((m) => ({
      organizationId: m.organizationId,
      role: m.role,
      organization: m.organization,
    })),
  };
});
