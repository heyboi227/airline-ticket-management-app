import Ajv from "ajv";
import addFormats from "ajv-formats";
import ServiceData from "../../../common/ServiceData.interface";

const ajv = new Ajv();
addFormats(ajv);

export interface AddDocumentDto {
  countryId: number;
  documentType: string;
  documentNumber: string;
  documentIssuingDate: string;
  documentExpirationDate: string;
  userId: number;
}

export interface AddDocument extends ServiceData {
  country_id: number;
  document_type: string;
  document_number: string;
  issued_date: string;
  expiry_date: string;
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
    documentIssuingDate: {
      type: "string",
    },
    documentExpirationDate: {
      type: "string",
    },
    userId: {
      type: "number",
    },
  },
  required: [
    "countryId",
    "documentType",
    "documentNumber",
    "documentIssuingDate",
    "documentExpirationDate",
    "userId",
  ],
  additionalProperties: false,
});

export { AddDocumentValidator };
