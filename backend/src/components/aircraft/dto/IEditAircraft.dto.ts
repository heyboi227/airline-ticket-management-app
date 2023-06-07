import Ajv from "ajv";
import IServiceData from "../../../common/IServiceData.interface";

const ajv = new Ajv();

export interface IEditAircraftDto {
  aircraftType?: string;
  aircraftName?: string;
}

export interface IEditAircraft extends IServiceData {
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
