import Ajv from "ajv";
import IServiceData from "../../../common/IServiceData.interface";

const ajv = new Ajv();

export interface IAddAirportDto {
  airportCode: string;
  airportName: string;
  city: string;
  countryId: number;
  timeZone: string;
}

export interface IAddAirport extends IServiceData {
  airport_code: string;
  name: string;
  city: string;
  country_id: number;
  time_zone: string;
}

const AddAirportValidator = ajv.compile({
  type: "object",
  properties: {
    airportCode: {
      type: "string",
      minLength: 3,
      maxLength: 3,
    },
    airportName: {
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
    timeZone: {
      type: "string",
      minLength: 2,
      maxLength: 128,
    },
  },
  required: ["airportCode", "airportName", "city", "countryId", "timeZone"],
  additionalProperties: false,
});

export { AddAirportValidator };
