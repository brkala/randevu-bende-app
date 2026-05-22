import '@/features/shared/lib/env-loader.server';
import { test as base, expect, type Response } from '@playwright/test';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';

export const test = base.extend<{
  db: PrismaClient;
  waitForHydration: () => Promise<void>;
  waitForServerFn: (options?: {
    timeout?: number;
    status?: number;
    condition?: (resp: Response) => boolean | Promise<boolean>;
  }) => Promise<Response>;
}>({
  // biome-ignore lint/correctness/noEmptyPattern: first arg must use destructuring pattern
  db: async ({}, use) => {
    const prisma = new PrismaClient({
      adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }),
    });
    await use(prisma);
    await prisma.$disconnect();
  },

  page: async ({ page }, use) => {
    page.on('console', (msg) => {
      const type = msg.type().toUpperCase();
      if (type === 'ERROR') {
        console.error(`[BROWSER ${type}] ❌ ${msg.text()}`);
      } else {
        console.log(`[BROWSER ${type}] ℹ️ ${msg.text()}`);
      }
    });

    page.on('pageerror', (err) => {
      console.error(`[BROWSER PAGE ERROR] 🚨 ${err.message}`);
    });

    await use(page);
  },

  waitForHydration: async ({ page }, use) => {
    const helper = async () => {
      await page.waitForFunction(() => document.body.dataset.hydrated === 'true', {
        timeout: 15000,
      });
    };

    await use(helper);
  },

  waitForServerFn: async ({ page }, use) => {
    const helper = async (options?: {
      timeout?: number;
      status?: number;
      condition?: (resp: Response) => boolean | Promise<boolean>;
    }) => {
      const targetStatus = options?.status ?? 200;
      return page.waitForResponse(
        async (resp) => {
          const isServerFn = resp.url().includes('_serverFn');
          const statusMatch = resp.status() === targetStatus;
          const extraMatch = options?.condition ? await options.condition(resp) : true;
          return isServerFn && statusMatch && extraMatch;
        },
        { timeout: options?.timeout ?? 10000 },
      );
    };
    await use(helper);
  },
});

export { expect };
