import Ajv from "ajv";
import IServiceData from "../../../common/IServiceData.interface";

const ajv = new Ajv();

export interface IAddTravelClassDto {
  name: string;
  subname: string;
}

export default interface IAddTravelClass extends IServiceData {
  name: string;
  subname: string;
}

const AddTravelClassValidator = ajv.compile({
  type: "object",
  properties: {
    name: {
      type: "string",
      minLength: 2,
      maxLength: 64,
    },
    subname: {
      type: "string",
      minLength: 2,
      maxLength: 64,
    },
  },
  required: ["name", "subname"],
  additionalProperties: false,
});

export { AddTravelClassValidator };
