import Ajv from "ajv";
import IServiceData from "../../../common/IServiceData.interface";

const ajv = new Ajv();

export interface IEditAircraftDto {
  type: string;
  name: string;
}

export interface IEditAircraft extends IServiceData {
  type: string;
  name: string;
}

const EditAircraftValidator = ajv.compile({
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

export { EditAircraftValidator };
