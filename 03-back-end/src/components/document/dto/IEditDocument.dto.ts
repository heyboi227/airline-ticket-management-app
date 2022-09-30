import Ajv from "ajv";
import addFormats from "ajv-formats";
import IServiceData from "../../../common/IServiceData.interface";

const ajv = new Ajv();
addFormats(ajv);

export interface IEditDocumentDto {
  countryId: number;
  type: string;
  documentNumber: string;
  userId: number;
}

export interface IEditDocument extends IServiceData {
  country_id: number;
  type: string;
  document_number: string;
  user_id: number;
}

const EditDocumentValidator = ajv.compile({
  type: "object",
  properties: {
    type: {
      type: "string",
      minLength: 8,
      maxLength: 12,
    },
    documentNumber: {
      type: "string",
      minLength: 2,
      maxLength: 50,
    },
  },
  required: ["type", "documentNumber"],
  additionalProperties: false,
});

export { EditDocumentValidator };
