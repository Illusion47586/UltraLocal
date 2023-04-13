import type { Prisma, PrismaClient } from "@prisma/client";
import { createPrismaRedisCache } from "prisma-redis-middleware";
import {
  RedisMemoryOptions,
  MemoryStorageOptions,
} from "prisma-redis-middleware/dist/types";

export interface ICacheStorageOptions {
  storage?:
    | {
        type: "redis";
        options?: RedisMemoryOptions;
      }
    | {
        type: "memory";
        options?: MemoryStorageOptions;
      };
  cacheTime?: number;
}

export const addCacheMiddleware = (
  prisma: PrismaClient,
  cacheStorageOptions?: ICacheStorageOptions
) => {
  const cacheMiddleware: Prisma.Middleware = createPrismaRedisCache({
    storage: cacheStorageOptions?.storage ?? {
      type: "memory",
      options: { size: 2048 },
    },
    cacheTime: cacheStorageOptions?.cacheTime ?? 300,
    excludeMethods: ["count", "groupBy"],
  });

  prisma.$use(cacheMiddleware);
};
