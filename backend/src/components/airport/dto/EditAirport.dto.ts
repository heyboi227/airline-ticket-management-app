import Ajv from "ajv";
import ServiceData from "../../../common/ServiceData.interface";

const ajv = new Ajv();

export interface EditAirportDto {
  airportCode?: string;
  airportName?: string;
  city?: string;
  countryId?: number;
  timeZoneId?: number;
}

export interface EditAirport extends ServiceData {
  airport_code?: string;
  name?: string;
  city?: string;
  country_id?: number;
  time_zone_id?: number;
}

const EditAirportValidator = ajv.compile({
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
  required: [],
  additionalProperties: false,
});

export { EditAirportValidator };
