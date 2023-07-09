import Ajv from "ajv";
import addFormats from "ajv-formats";
import ServiceData from "../../../common/ServiceData.interface";

const ajv = new Ajv();
addFormats(ajv);

export interface AddCountryDto {
  countryName: string;
}

export interface AddCountry extends ServiceData {
  country_name: string;
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
