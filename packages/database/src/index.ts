import { PrismaClient } from "@prisma/client";
import { addCacheMiddleware } from "./middlewares/cache";
import { addIDGeneratorMiddleware } from "./middlewares/idGenerator";
import { addLoggingMiddleware } from "./middlewares/logger";

declare global {
  var prisma: PrismaClient | undefined;
}

export const prisma = global.prisma || new PrismaClient();

if (!global.prisma) {
  // MIDDLEWARES
  // GENERAL
  addCacheMiddleware(prisma);
  addLoggingMiddleware(prisma);
  addIDGeneratorMiddleware(prisma);
}

if (process.env.NODE_ENV !== "production") global.prisma = prisma;

export * from "@prisma/client";
export * from "./utils";
