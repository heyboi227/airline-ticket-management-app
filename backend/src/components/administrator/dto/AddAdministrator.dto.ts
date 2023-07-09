import Ajv from "ajv";
import ServiceData from "../../../common/ServiceData.interface";

const ajv = new Ajv();

export default interface AddAdministrator extends ServiceData {
  username: string;
  password_hash: string;
}

export interface AddAdministratorDto {
  username: string;
  password: string;
}

const AddAdministratorValidator = ajv.compile({
  type: "object",
  properties: {
    username: {
      type: "string",
      pattern: "^[a-z-0-9]{5,64}$",
    },
    password: {
      type: "string",
      pattern: "^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z]).{6,}$",
    },
  },
  required: ["username", "password"],
  additionalProperties: false,
});

export { AddAdministratorValidator };
