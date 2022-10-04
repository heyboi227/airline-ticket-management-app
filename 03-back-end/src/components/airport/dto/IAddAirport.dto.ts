import Ajv from "ajv";
import IServiceData from "../../../common/IServiceData.interface";

const ajv = new Ajv();

export interface IAddAirportDto {
  airportCode: string;
  name: string;
  city: string;
  countryId: number;
}

export interface IAddAirport extends IServiceData {
  airport_code: string;
  name: string;
  city: string;
  country_id: number;
}

const AddAirportValidator = ajv.compile({
  type: "object",
  properties: {
    airportCode: {
      type: "string",
      minLength: 3,
      maxLength: 3,
    },
    name: {
      type: "string",
      minLength: 2,
      maxLength: 128,
    },
    city: {
      type: "string",
      minLength: 2,
      maxLength: 128,
    },
    countryId: {
      type: "number",
    },
  },
  required: ["airportCode", "name", "city", "countryId"],
  additionalProperties: false,
});

export { AddAirportValidator };
