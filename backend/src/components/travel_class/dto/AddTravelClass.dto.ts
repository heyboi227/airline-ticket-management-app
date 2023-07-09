import Ajv from "ajv";
import ServiceData from "../../../common/ServiceData.interface";

const ajv = new Ajv();

export interface AddTravelClassDto {
  travelClassName: string;
  travelClassSubname: string;
}

export default interface AddTravelClass extends ServiceData {
  travel_class_name: string;
  travel_class_subname: string;
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
