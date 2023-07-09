import Ajv from "ajv";
import addFormats from "ajv-formats";
import ServiceData from "../../../common/ServiceData.interface";

const ajv = new Ajv();
addFormats(ajv);

export interface AddDocumentDto {
  countryId: number;
  documentType: string;
  documentNumber: string;
  userId: number;
}

export interface AddDocument extends ServiceData {
  country_id: number;
  document_type: string;
  document_number: string;
  user_id: number;
}

const AddDocumentValidator = ajv.compile({
  type: "object",
  properties: {
    countryId: {
      type: "number",
    },
    documentType: {
      type: "string",
      minLength: 8,
      maxLength: 12,
    },
    documentNumber: {
      type: "string",
      minLength: 2,
      maxLength: 50,
    },
    userId: {
      type: "number",
    },
  },
  required: ["countryId", "documentType", "documentNumber", "userId"],
  additionalProperties: false,
});

export { AddDocumentValidator };
