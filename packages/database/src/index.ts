import { PrismaClient } from "@prisma/client";
import { addCacheMiddleware, ICacheStorageOptions } from "./middlewares/cache";
import { addIDGeneratorMiddleware } from "./middlewares/idGenerator";
import { addLoggingMiddleware } from "./middlewares/logger";
import { addContentParamFinderMiddleware } from "./middlewares/contentParam";
import { main } from "./seed";

export interface IDatabaseConfig {
  cacheOptions?: ICacheStorageOptions;
}

declare global {
  var prisma: PrismaClient | undefined;
}

export const prisma = global.prisma || new PrismaClient();

if (!global.prisma) {
  try {
    // MIDDLEWARES
    // GENERAL
    if (process.env.NODE_ENV === "production") addCacheMiddleware(prisma);
    addLoggingMiddleware(prisma);
    addIDGeneratorMiddleware(prisma);
    addContentParamFinderMiddleware(prisma);
    // main();
  } catch (error) {
    prismaLogger?.error(error);
  }
}
if (process.env.NODE_ENV !== "production") global.prisma = prisma;

export * from "@prisma/client";
export * from "./utils";
