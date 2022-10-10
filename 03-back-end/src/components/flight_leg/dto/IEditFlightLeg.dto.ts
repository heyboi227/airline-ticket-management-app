import Ajv from "ajv";
import addFormats from "ajv-formats";
import IServiceData from "../../../common/IServiceData.interface";

const ajv = new Ajv();
addFormats(ajv);

export interface IEditFlightLegDto {
  flightCode: string;
  originAirportId: number;
  destinationAirportId: number;
  departureDateAndTime: string;
  arrivalDateAndTime: string;
  aircraftId: number;
  bags: {
    bagId: number;
    price: number;
  }[];
  travelClasses: {
    travelClassId: number;
    price: number;
  }[];
}

export interface IEditFlightLeg extends IServiceData {
  flight_code: string;
  origin_airport_id: number;
  destination_airport_id: number;
  departure_date_and_time: string;
  arrival_date_and_time: string;
  aircraft_id: number;
}

const EditFlightLegValidator = ajv.compile({
  type: "object",
  properties: {
    flightCode: {
      type: "string",
      minLength: 5,
      maxLength: 6,
    },
    originAirportId: {
      type: "number",
    },
    destinationAirportId: {
      type: "number",
    },
    departureDateAndTime: {
      type: "string",
    },
    arrivalDateAndTime: {
      type: "string",
    },
    aircraftId: {
      type: "number",
    },
    bags: {
      type: "array",
      minItems: 1,
      uniqueItems: true,
      items: {
        type: "object",
        properties: {
          bagId: {
            type: "number",
          },
          price: {
            type: "number",
            multipleOf: 0.01,
            minimum: 0.01,
          },
        },
        required: ["bagId", "price"],
        additionalProperties: false,
      },
    },
    travelClasses: {
      type: "array",
      minItems: 1,
      uniqueItems: true,
      items: {
        type: "object",
        properties: {
          travelClassId: {
            type: "number",
          },
          price: {
            type: "number",
            multipleOf: 0.01,
            minimum: 0.01,
          },
        },
        required: ["travelClassId", "price"],
        additionalProperties: false,
      },
    },
  },
  required: [
    "flightCode",
    "originAirportId",
    "destinationAirportId",
    "departureDateAndTime",
    "arrivalDateAndTime",
    "aircraftId",
    "bags",
    "travelClasses",
  ],
  additionalProperties: false,
});

export { EditFlightLegValidator };
