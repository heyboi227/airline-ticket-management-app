import Ajv from "ajv";
import addFormats from "ajv-formats";
import IServiceData from "../../../common/IServiceData.interface";

const ajv = new Ajv();
addFormats(ajv);

export interface IEditCountryDto {
  name: string;
}

export interface IEditCountry extends IServiceData {
  name: string;
}

const EditCountryValidator = ajv.compile({
  type: "object",
  properties: {
    name: {
      type: "string",
      minLength: 2,
      maxLength: 128,
    },
  },
  required: ["name"],
  additionalProperties: false,
});

export { EditCountryValidator };
