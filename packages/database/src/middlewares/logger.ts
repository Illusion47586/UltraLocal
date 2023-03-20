import type { Prisma, PrismaClient } from "@prisma/client";
import { prismaLogger } from "@ultralocal/utils";

export const addLoggingMiddleware = (prisma: PrismaClient) => {
  const loggingMiddleware: Prisma.Middleware = async (params, next) => {
    const before = Date.now();

    const result = await next(params);

    const after = Date.now();

    prismaLogger.info(
      `Query ${params.model}.${params.action} took ${after - before}ms`
    );

    return result;
  };

  prisma.$use(loggingMiddleware);
};
