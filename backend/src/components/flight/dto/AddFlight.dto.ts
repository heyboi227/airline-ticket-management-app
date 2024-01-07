import Ajv from "ajv";
import addFormats from "ajv-formats";
import ServiceData from "../../../common/ServiceData.interface";

const ajv = new Ajv();
addFormats(ajv);

export interface AddFlightDto {
  flightCode: string;
  originAirportId: number;
  destinationAirportId: number;
  departureDateAndTime: string;
  arrivalDateAndTime: string;
  aircraftId: number;
  travelClasses: {
    travelClassId: number;
    price: number;
  }[];
}

export interface FlightSearchDto {
  originAirportId: number;
  destinationAirportId: number;
  flightDate: string;
}

export interface AddFlight extends ServiceData {
  flight_code: string;
  origin_airport_id: number;
  destination_airport_id: number;
  departure_date_and_time: string;
  arrival_date_and_time: string;
  aircraft_id: number;
}

export interface FlightSearch extends ServiceData {
  origin_airport_id: number;
  destination_airport_id: number;
  departure_date: string;
}

export interface FlightTravelClass extends ServiceData {
  flight_id: number;
  travel_class_id: number;
  price: number;
  is_active?: number;
}

const AddFlightValidator = ajv.compile({
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
    "travelClasses",
  ],
  additionalProperties: false,
});

export { AddFlightValidator };
