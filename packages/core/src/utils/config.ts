import { cosmiconfigSync } from "cosmiconfig";
import { TypeScriptLoader } from "cosmiconfig-typescript-loader";
import { coreLogger } from "@ultralocal/utils";
import { CosmiconfigResult } from "cosmiconfig/dist/types";

export interface UltraLocalConfig {
  apiBaseUrl?: string;
}

const defaultConfig: UltraLocalConfig = {
  apiBaseUrl: "http://localhost:3000/api",
};

const moduleName = "ultralocal";
const explorer = cosmiconfigSync(moduleName, {
  searchPlaces: [
    `.config/${moduleName}.config.js`,
    `.config/${moduleName}.config.ts`,
    `.config/${moduleName}.config.cjs`,
    `${moduleName}.config.js`,
    `${moduleName}.config.ts`,
    `${moduleName}.config.cjs`,
  ],
  loaders: { ".ts": TypeScriptLoader() },
});

declare global {
  var config: UltraLocalConfig;
}

export { explorer };

export const search = () => {
  let configResult: CosmiconfigResult | undefined;
  try {
    configResult = explorer.search();
  } catch (error) {
    coreLogger.error(error);
  }
  return { ...defaultConfig, ...configResult?.config };
};

export const config = global.config || search();

if (process.env.NODE_ENV !== "production") global.config = config;
