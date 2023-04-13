import { coreLogger } from "@ultralocal/utils";
import { Axios } from "axios";
import { config } from "./config";

declare global {
  var axios: Axios;
}

const createAxios = () => {
  const { apiBaseUrl } = config;
  coreLogger.info(`Creating new axios instance with baseUrl: ${apiBaseUrl}`);
  return new Axios({ baseURL: apiBaseUrl });
};

export const axios = global.axios || createAxios();

if (process.env.NODE_ENV !== "production") global.config = config;
