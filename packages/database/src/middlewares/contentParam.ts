import type { Prisma, PrismaClient } from "@prisma/client";
import { Literal } from "../utils";

export const addContentParamFinderMiddleware = (prisma: PrismaClient) => {
  const contentParamFinderMiddleware: Prisma.Middleware = async (
    params,
    next
  ) => {
    const { model, action, args } = params;
    if (model === "Content" && (action === "create" || action === "update")) {
      const literal = args.data.literal as string;
      const numberOfParams = new Literal(literal).numberOfParams;
      args.data.numberOfParams = numberOfParams;
    }
    return next(params);
  };

  prisma.$use(contentParamFinderMiddleware);
};
