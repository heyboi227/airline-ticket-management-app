import Ajv from "ajv";
import addFormats from "ajv-formats";
import IServiceData from "../../../common/IServiceData.interface";

const ajv = new Ajv();
addFormats(ajv);

export interface IAddTicketDto {
  ticketNumber: string;
  ticketHolderName: string;
  documentId: number;
  price: number;
  userId: number;
  flightId: number;
  seatNumber: string;
}

export interface IAddTicket extends IServiceData {
  ticket_number: string;
  ticket_holder_name: string;
  document_id: number;
  price: number;
  user_id: number;
  flight_id: number;
  seat_number: string;
}

const AddTicketValidator = ajv.compile({
  type: "object",
  properties: {
    ticketNumber: {
      type: "string",
      minLength: 2,
      maxLength: 50,
    },
    ticketHolderName: {
      type: "string",
      minLength: 2,
      maxLength: 50,
    },
    documentId: {
      type: "number",
    },
    price: {
      type: "number",
    },
    userId: {
      type: "number",
    },
    flightId: {
      type: "number",
    },
    seatNumber: {
      type: "string",
      minLength: 2,
      maxLength: 50,
    },
  },
  required: ["ticketNumber", "ticketHolderName", "documentId", "price", "userId", "flightId", "seatNumber"],
  additionalProperties: false,
});

export { AddTicketValidator };
