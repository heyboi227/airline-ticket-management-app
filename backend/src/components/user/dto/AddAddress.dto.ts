import Ajv from "ajv";
import addFormats from "ajv-formats";
import ServiceData from "../../../common/ServiceData.interface";

const ajv = new Ajv();
addFormats(ajv);

export interface AddAddressDto {
  streetAndNumber: string;
  zipCode: string;
  city: string;
  countryId: number;
  phoneNumber: string;
  userId: number;
}

export interface AddAddress extends ServiceData {
  user_id: number;
  street_and_number: string;
  zip_code: string;
  city: string;
  country_id: number;
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
      type: "string",
      minLength: 2,
      maxLength: 10,
    },
    city: {
      type: "string",
      minLength: 2,
      maxLength: 64,
    },
    countryId: {
      type: "integer",
    },
    phoneNumber: {
      type: "string",
      pattern: "\\+[0-9]{8,23}",
    },
    userId: {
      type: "integer",
    },
  },
  required: [
    "streetAndNumber",
    "zipCode",
    "city",
    "countryId",
    "phoneNumber",
    "userId",
  ],
  additionalProperties: false,
});

export { AddAddressValidator };
