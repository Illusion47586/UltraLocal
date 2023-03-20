import type { Prisma, PrismaClient } from "@prisma/client";
import { createPrismaRedisCache } from "prisma-redis-middleware";

export const addCacheMiddleware = (prisma: PrismaClient) => {
  const cacheMiddleware: Prisma.Middleware = createPrismaRedisCache({
    storage: {
      type: "memory",
      options: { size: 2048 },
    },
    cacheTime: 300,
    excludeMethods: ["count", "groupBy"],
  });

  prisma.$use(cacheMiddleware);
};
