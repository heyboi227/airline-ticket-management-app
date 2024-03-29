import Ajv from "ajv";
import addFormats from "ajv-formats";
import ServiceData from "../../../common/ServiceData.interface";

const ajv = new Ajv();
addFormats(ajv);

export interface RegisterUserDto {
  email: string;
  password: string;
  forename: string;
  surname: string;
}

export interface RegisterUser extends ServiceData {
  email: string;
  password_hash: string;
  forename: string;
  surname: string;
  activation_code: string;
}

const RegisterUserValidator = ajv.compile({
  type: "object",
  properties: {
    email: {
      type: "string",
      format: "email",
    },
    password: {
      type: "string",
      pattern: "^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z]).{6,}$",
    },
    forename: {
      type: "string",
      minLength: 2,
      maxLength: 64,
    },
    surname: {
      type: "string",
      minLength: 2,
      maxLength: 64,
    },
  },
  required: ["email", "password", "forename", "surname"],
  additionalProperties: false,
});

export { RegisterUserValidator };
