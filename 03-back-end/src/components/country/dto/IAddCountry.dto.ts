import Ajv from "ajv";
import addFormats from "ajv-formats";
import IServiceData from "../../../common/IServiceData.interface";

const ajv = new Ajv();
addFormats(ajv);

export interface IAddCountryDto {
  name: string;
}

export interface IAddCountry extends IServiceData {
  name: string;
}

const AddCountryValidator = ajv.compile({
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

export { AddCountryValidator };
