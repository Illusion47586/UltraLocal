import {
  Content,
  Group,
  Label,
  Organization,
  Project,
  Tag,
  User,
  isId,
} from "@ultralocal/database";
import { axios } from "../utils/axios";

type Data = Organization & {
  projects?: Project[];
  users?: User[];
  tags?: Tag[];
  groups?: Group[];
  labels?: Label[];
  content?: Content[];
};

export class OrganizationController {
  data: Data;

  constructor(data: Data) {
    this.data = data;
  }

  create = async () => {
    const response = await axios.post("/organization", this.data);
    if (response.status !== 200)
      throw Error(response.data ?? response.statusText, {
        cause: response.status,
      });
    this.data = response.data;
  };

  static fromJson = (json: Record<string, any>) => {
    try {
      const _data: Organization = json as Data;
      return new OrganizationController(_data);
    } catch (error) {
      coreLogger?.error(error);
    }
  };

  static fromId = async (id: string) => {
    try {
      if (!isId("Organization", id)) throw Error("Invalid organization ID");
      const response = await axios.get("/organization", {
        params: { id },
      });
      if (response.status !== 200)
        throw Error(response.data ?? response.statusText, {
          cause: response.status,
        });
      return new OrganizationController(response.data);
    } catch (error) {
      coreLogger?.error(error);
    }
  };

  static fromName = async (name: string) => {
    try {
      const response = await axios.get("/organization", {
        params: { name },
      });
      if (response.status !== 200)
        throw Error(response.data ?? response.statusText, {
          cause: response.status,
        });
      return new OrganizationController(response.data);
    } catch (error) {
      coreLogger?.error(error);
    }
  };
}
