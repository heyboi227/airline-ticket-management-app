import Ajv from "ajv";
import IServiceData from "../../../common/IServiceData.interface";

const ajv = new Ajv();

export interface IAddAircraftDto {
  type: string;
  name: string;
}

export interface IAddAircraft extends IServiceData {
  type: string;
  name: string;
}

const AddAircraftValidator = ajv.compile({
  type: "object",
  properties: {
    type: {
      type: "string",
    },
    name: {
      type: "string",
      minLength: 2,
      maxLength: 128,
    },
  },
  required: ["type", "name"],
  additionalProperties: false,
});

export { AddAircraftValidator };
