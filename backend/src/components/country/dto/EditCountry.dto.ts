import Ajv from "ajv";
import addFormats from "ajv-formats";
import ServiceData from "../../../common/ServiceData.interface";

const ajv = new Ajv();
addFormats(ajv);

export interface EditCountryDto {
  countryName: string;
}

export interface EditCountry extends ServiceData {
  country_name: string;
}

const EditCountryValidator = ajv.compile({
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

export { EditCountryValidator };
