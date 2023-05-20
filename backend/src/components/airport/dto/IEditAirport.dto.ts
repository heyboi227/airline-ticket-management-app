import Ajv from "ajv";
import IServiceData from "../../../common/IServiceData.interface";

const ajv = new Ajv();

export interface IEditAirportDto {
  airportCode?: string;
  airportName?: string;
  city?: string;
}

export interface IEditAirport extends IServiceData {
  airport_code?: string;
  name?: string;
  city?: string;
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
  },
  required: [],
  additionalProperties: false,
});

export { EditAirportValidator };
