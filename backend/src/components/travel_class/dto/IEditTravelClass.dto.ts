import Ajv from "ajv";
import IServiceData from "../../../common/IServiceData.interface";

const ajv = new Ajv();

export default interface IEditTravelClass extends IServiceData {
  name?: string;
  subname?: string;
}

interface IEditTravelClassDto {
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

export { EditTravelClassValidator, IEditTravelClassDto };
