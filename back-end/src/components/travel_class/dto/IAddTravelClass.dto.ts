import Ajv from "ajv";
import IServiceData from "../../../common/IServiceData.interface";

const ajv = new Ajv();

export interface IAddTravelClassDto {
  name: string;
}

export default interface IAddTravelClass extends IServiceData {
  name: string;
}

const AddTravelClassValidator = ajv.compile({
  type: "object",
  properties: {
    name: {
      type: "string",
      minLength: 2,
      maxLength: 64,
    },
  },
  required: ["name"],
  additionalProperties: false,
});

export { AddTravelClassValidator };
