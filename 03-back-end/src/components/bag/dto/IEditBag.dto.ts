import Ajv from "ajv";
import IServiceData from "../../../common/IServiceData.interface";

const ajv = new Ajv();

export default interface IEditBag extends IServiceData {
  name: string;
}

export interface IEditBagDto {
  name: string;
}

const EditBagValidator = ajv.compile({
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

export { EditBagValidator };
