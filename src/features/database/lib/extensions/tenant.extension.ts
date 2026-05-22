import { Prisma } from '@prisma/client';
import { TENANT_MODELS } from '../constants';

export function tenantExtension(shopId: string) {
  return Prisma.defineExtension({
    query: {
      $allModels: {
        // biome-ignore lint/suspicious/noExplicitAny: prisma query types are dynamic and highly complex
        async $allOperations({ model, args, query }: { model: string; args: any; query: any }) {
          if (TENANT_MODELS.includes(model)) {
            args.where = {
              ...(args.where || {}),
              shopId,
            };
          }
          return query(args);
        },
      },
    },
  });
}
