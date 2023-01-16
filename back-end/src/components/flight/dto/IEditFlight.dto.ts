import Ajv from "ajv";
import addFormats from "ajv-formats";
import IServiceData from "../../../common/IServiceData.interface";

const ajv = new Ajv();
addFormats(ajv);

export interface IEditFlightDto {
  flightFareCode: string;
}

export interface IEditFlight extends IServiceData {
  flight_fare_code: string;
}

const EditFlightValidator = ajv.compile({
  type: "object",
  properties: {
    flightFareCode: {
      type: "string",
      minLength: 2,
      maxLength: 50,
    },
  },
  required: ["flightFareCode"],
  additionalProperties: false,
});

export { EditFlightValidator };
