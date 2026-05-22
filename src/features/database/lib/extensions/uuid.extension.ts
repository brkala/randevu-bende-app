import { Prisma } from '@prisma/client';
import { v7 as uuidv7 } from 'uuid';
import { uuidSchema } from '../../schemas/uuid.schema';

export const uuidExtension = Prisma.defineExtension({
  query: {
    $allModels: {
      // biome-ignore lint/suspicious/noExplicitAny: prisma query types are dynamic and highly complex
      async create({ args, query }: { args: any; query: any }) {
        if (args.data) {
          const isUuid = uuidSchema.safeParse(args.data.id).success;
          if (!isUuid) {
            args.data.id = uuidv7();
          }
        }
        return query(args);
      },
      // biome-ignore lint/suspicious/noExplicitAny: prisma query types are dynamic and highly complex
      async createMany({ args, query }: { args: any; query: any }) {
        const data = args.data;
        if (data) {
          const list = Array.isArray(data) ? data : [data];
          for (const item of list) {
            const isUuid = uuidSchema.safeParse(item.id).success;
            if (!isUuid) {
              item.id = uuidv7();
            }
          }
        }
        return query(args);
      },
    },
  },
});
