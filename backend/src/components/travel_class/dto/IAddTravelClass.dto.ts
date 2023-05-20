import Ajv from "ajv";
import IServiceData from "../../../common/IServiceData.interface";

const ajv = new Ajv();

export interface IAddTravelClassDto {
  travelClassName: string;
  travelClassSubname: string;
}

export default interface IAddTravelClass extends IServiceData {
  name: string;
  subname: string;
}

const AddTravelClassValidator = ajv.compile({
  type: "object",
  properties: {
    travelClassName: {
      type: "string",
      minLength: 2,
      maxLength: 64,
    },
    travelClassSubname: {
      type: "string",
      minLength: 2,
      maxLength: 64,
    },
  },
  required: ["travelClassName", "travelClassSubname"],
  additionalProperties: false,
});

export { AddTravelClassValidator };
