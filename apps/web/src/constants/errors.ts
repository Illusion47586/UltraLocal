export const ERRORS = {
  ORGANIZATION: {
    INVALID_PARAMS: {
      error: "Invalid params, either id or name param is required.",
      status: 400,
      NAME_ONLY: {
        error: "Invalid body, name attribute in the body is required.",
        status: 400,
      },
      ID_ONLY: {
        error: "Invalid params, id param is required.",
        status: 400,
      },
    },
    ID_ONLY: {
      error: "Invalid params, id param is required.",
      status: 400,
    },
    NOT_FOUND: {
      error: "Organization not found, try using correct id or name.",
      status: 404,
    },
    FOUND: {
      error:
        "This organization already exists, please delete the old one to create a new one.",
      status: 409,
    },
  },
  PROJECT: {
    INVALID_PARAMS: {
      error:
        "Invalid params, org_id and (project name or id) are required params.",
      status: 400,
      ORG_ID_ONLY: {
        error: "Invalid params, org_id param is required.",
        status: 400,
      },
      NAME_ONLY: {
        error: "Invalid body, name attribute in the body is required.",
        status: 400,
      },
      NAME_AND_PROJECT: {
        error:
          "Invalid body, name and projectId attribute in the body is required.",
        status: 400,
      },
    },
    FOUND: {
      error:
        "This project already exists, please delete the old one to create a new one.",
      status: 409,
    },
    NOT_FOUND: {
      error:
        "Project not found, try using correct project id or name along with correct organization id.",
      status: 404,
    },
  },
};
