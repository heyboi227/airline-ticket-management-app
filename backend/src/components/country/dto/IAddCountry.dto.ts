import Ajv from "ajv";
import addFormats from "ajv-formats";
import IServiceData from "../../../common/IServiceData.interface";

const ajv = new Ajv();
addFormats(ajv);

export interface IAddCountryDto {
  countryName: string;
}

export interface IAddCountry extends IServiceData {
  name: string;
}

const AddCountryValidator = ajv.compile({
  type: "object",
  properties: {
    countryName: {
      type: "string",
      minLength: 2,
      maxLength: 128,
    },
  },
  required: ["countryName"],
  additionalProperties: false,
});

export { AddCountryValidator };
