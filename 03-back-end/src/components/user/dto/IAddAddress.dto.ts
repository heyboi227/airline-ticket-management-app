import Ajv from "ajv";
import addFormats from "ajv-formats";
import IServiceData from "../../../common/IServiceData.interface";

const ajv = new Ajv();
addFormats(ajv);

export interface IAddAddressDto {
  streetAndNumber: string;
  zipCode: number;
  city: string;
  country: string;
  phoneNumber: string;
}

export interface IAddAddress extends IServiceData {
  user_id: number;
  street_and_number: string;
  zip_code: number;
  city: string;
  country: string;
  phone_number: string;
}

const AddAddressValidator = ajv.compile({
  type: "object",
  properties: {
    streetAndNumber: {
      type: "string",
      minLength: 2,
      maxLength: 255,
    },
    zipCode: {
      type: "integer",
    },
    city: {
      type: "string",
      minLength: 2,
      maxLength: 64,
    },
    country: {
      type: "string",
      minLength: 2,
      maxLength: 64,
    },
    phoneNumber: {
      type: "string",
      pattern: "\\+[0-9]{8,23}",
    },
  },
  required: ["streetAndNumber", "zipCode", "city", "country", "phoneNumber"],
  additionalProperties: false,
});

export { AddAddressValidator };
