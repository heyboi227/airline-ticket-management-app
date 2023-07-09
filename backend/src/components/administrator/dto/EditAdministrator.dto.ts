import Ajv from "ajv";
import ServiceData from "../../../common/ServiceData.interface";

const ajv = new Ajv();

export default interface EditAdministrator extends ServiceData {
  password_hash?: string;
  is_active?: number;
}

export interface EditAdministratorDto {
  password?: string;
  isActive?: boolean;
}

const EditAdministratorValidator = ajv.compile({
  type: "object",
  properties: {
    password: {
      type: "string",
      pattern: "^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z]).{6,}$",
    },
    isActive: {
      type: "boolean",
    },
  },
  required: [],
  additionalProperties: false,
});

export { EditAdministratorValidator };
