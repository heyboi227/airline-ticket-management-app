import Ajv from "ajv";
import IServiceData from "../../../common/IServiceData.interface";

const ajv = new Ajv();

export interface IAddAirportDto {
  airportCode: string;
  airportName: string;
  city: string;
  countryId: number;
  timeZoneId: number;
}

export interface IAddAirport extends IServiceData {
  airport_code: string;
  airport_name: string;
  city: string;
  country_id: number;
  time_zone_id: number;
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
    timeZoneId: {
      type: "number",
    },
  },
  required: ["airportCode", "airportName", "city", "countryId", "timeZoneId"],
  additionalProperties: false,
});

export { AddAirportValidator };
