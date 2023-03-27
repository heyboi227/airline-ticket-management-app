import Ajv from "ajv";
import addFormats from "ajv-formats";
import IServiceData from "../../../common/IServiceData.interface";

const ajv = new Ajv();
addFormats(ajv);

export interface IAddFlightDto {
  flightFareCode: string;
  flightLegs: {
    flightLegId: number;
  }[];
}

export interface IAddFlight extends IServiceData {
  flight_fare_code: string;
}

export interface IFlightFlightLeg extends IServiceData {
  flight_id: number;
  flight_leg_id: number;
  is_active?: number;
}

const AddFlightValidator = ajv.compile({
  type: "object",
  properties: {
    flightFareCode: {
      type: "string",
      minLength: 2,
      maxLength: 50,
    },
    flightLegs: {
      type: "array",
      minItems: 1,
      uniqueItems: true,
      items: {
        type: "object",
        properties: {
          flightLegId: {
            type: "number",
          },
        },
        required: ["flightLegId"],
        additionalProperties: false,
      },
    },
  },
  required: ["flightFareCode", "flightLegs"],
  additionalProperties: false,
});

export { AddFlightValidator };
