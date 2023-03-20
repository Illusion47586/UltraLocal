import { Prisma } from "@prisma/client";
import { APPLICABLE_MODELS } from "../middlewares/idGenerator";

export const isId = (model: Prisma.ModelName, test: string) => {
  if (APPLICABLE_MODELS.includes(model))
    throw new Error(
      'Can\'t check id of unsupported data models, please search for APPLICABLE_MODELS in package "database"'
    );
  const [prefix, core] = test.split("-");
  const isPrefixMatching = prefix === model[0].toLowerCase();
  if (!isPrefixMatching) return false;
  return core.match(/^[a-zA-Z0-9]{10}$/);
};
