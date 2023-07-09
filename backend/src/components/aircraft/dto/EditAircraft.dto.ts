import Ajv from "ajv";
import ServiceData from "../../../common/ServiceData.interface";

const ajv = new Ajv();

export interface EditAircraftDto {
  aircraftType?: string;
  aircraftName?: string;
}

export interface EditAircraft extends ServiceData {
  aircraft_type?: string;
  aircraft_name?: string;
}

const EditAircraftValidator = ajv.compile({
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
  required: [],
  additionalProperties: false,
});

export { EditAircraftValidator };
