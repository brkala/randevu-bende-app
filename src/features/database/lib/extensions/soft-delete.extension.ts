import { Prisma } from '@prisma/client';

export const softDeleteExtension = Prisma.defineExtension((client) => {
  return client.$extends({
    name: 'softDelete',
    query: {
      $allModels: {
        async $allOperations({ model, operation, args, query }) {
          const softDeleteModels = ['Shop', 'StaffProfile'];
          if (!softDeleteModels.includes(model as string)) {
            return query(args);
          }

          if (operation === 'findMany' || operation === 'findFirst' || operation === 'count') {
            args.where = { ...args.where, deletedAt: null };
          }
          return query(args);
        },
      },
    },
  });
});
