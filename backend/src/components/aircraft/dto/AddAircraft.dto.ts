import Ajv from "ajv";
import ServiceData from "../../../common/ServiceData.interface";

const ajv = new Ajv();

export interface AddAircraftDto {
  aircraftType: string;
  aircraftName: string;
}

export interface AddAircraft extends ServiceData {
  aircraft_type: string;
  aircraft_name: string;
}

const AddAircraftValidator = ajv.compile({
  type: "object",
  properties: {
    aircraftType: {
      type: "string",
    },
    aircraftName: {
      type: "string",
      minLength: 2,
      maxLength: 128,
    },
  },
  required: ["aircraftType", "aircraftName"],
  additionalProperties: false,
});

export { AddAircraftValidator };
