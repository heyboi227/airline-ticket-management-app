import Ajv from "ajv";
import IServiceData from "../../../common/IServiceData.interface";

const ajv = new Ajv();

export default interface IEditTravelClass extends IServiceData {
  name: string;
  subname: string;
}

interface IEditTravelClassDto {
  name: string;
  subname: string;
}

const EditTravelClassValidator = ajv.compile({
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

export { EditTravelClassValidator, IEditTravelClassDto };
