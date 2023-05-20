import Ajv from "ajv";
import IServiceData from "../../../common/IServiceData.interface";

const ajv = new Ajv();

export interface IAddAircraftDto {
  aircraftType: string;
  aircraftName: string;
}

export interface IAddAircraft extends IServiceData {
  type: string;
  name: string;
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
