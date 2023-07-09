import Ajv from "ajv";
import ServiceData from "../../../common/ServiceData.interface";

const ajv = new Ajv();

export default interface EditTravelClass extends ServiceData {
  travel_class_name?: string;
  travel_class_subname?: string;
}

interface EditTravelClassDto {
  travelClassName?: string;
  travelClassSubname?: string;
}

const EditTravelClassValidator = ajv.compile({
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
  required: [],
  additionalProperties: false,
});

export { EditTravelClassValidator, EditTravelClassDto };
