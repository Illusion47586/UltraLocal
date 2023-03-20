import { Prisma, PrismaClient } from "@prisma/client";
import { customRandom, random } from "nanoid";

const SMALL_ALPHA = "abcdefghijklmnopqrstuvwxyz";
const BIG_ALPHA = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const DIGITS = "0123456789";

export const APPLICABLE_MODELS = [
  "Organization",
  "Project",
  "Group",
  "Label",
  "Content",
];

export const getPrefix = (model: string) => {
  switch (model) {
    case "Organization":
      return "o";
    case "Project":
      return "p";
    case "Group":
      return "g";
    case "Label":
      return "l";
    case "Content":
      return "c";
    default:
      return "i";
  }
};

export const addIDGeneratorMiddleware = (prisma: PrismaClient) => {
  const nanoid = customRandom(SMALL_ALPHA + BIG_ALPHA + DIGITS, 10, random);
  const idGeneratorMiddleware: Prisma.Middleware = async (params, next) => {
    const { action, model } = params;
    if (model && APPLICABLE_MODELS.includes(model) && action === "create") {
      params.args.data.id = getPrefix(model) + "-" + nanoid();
    }
    return next(params);
  };

  prisma.$use(idGeneratorMiddleware);
};
