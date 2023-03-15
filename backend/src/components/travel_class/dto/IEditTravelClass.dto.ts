import Ajv from "ajv";
import IServiceData from "../../../common/IServiceData.interface";

const ajv = new Ajv();

export default interface IEditTravelClass extends IServiceData {
  name: string;
}

interface IEditTravelClassDto {
  name: string;
}

const EditTravelClassValidator = ajv.compile({
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

export { EditTravelClassValidator, IEditTravelClassDto };
