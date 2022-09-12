import Ajv from "ajv";
import addFormats from "ajv-formats";
import IServiceData from "../../../common/IServiceData.interface";

const ajv = new Ajv();
addFormats(ajv);

export interface IAddFlightDto {
  flightFareCode: string;
}

export interface IAddFlight extends IServiceData {
  flight_fare_code: string;
}

const AddFlightValidator = ajv.compile({
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

export { AddFlightValidator };
