import Ajv from "ajv";
import addFormats from "ajv-formats";
import FlightModel from "../../flight/FlightModel.model";

const ajv = new Ajv();
addFormats(ajv);

export interface BookingConfirmationDto {
  email: string;
  bookingNumber: string;
  flightDetails: {
    departFlight: FlightModel;
    returnFlight?: FlightModel;
    departureTravelClass: string;
    returnTravelClass?: string;
    basePrice: number;
    taxesAndFeesPrice: number;
    totalPrice: number;
  };
  seatDetails: {
    departSeat: string;
    returnSeat?: string;
  };
  ticketHolderDetails: {
    firstName: string;
    lastName: string;
    dateOfBirth: string;
    documentId: number | null;
    documentType: "National ID" | "Passport";
    documentNumber: string;
    documentIssuingDate: string;
    documentExpirationDate: string;
  };
  paymentDetails: {
    cardNumber: string;
    paymentTimestamp: string;
  };
}

const BookingConfirmationValidator = ajv.compile({
  type: "object",
  properties: {
    email: {
      type: "string",
      format: "email",
    },
    bookingNumber: {
      type: "string",
      minLength: 6,
      maxLength: 6,
    },
    flightDetails: {
      type: "object",
      properties: {
        departFlight: { type: "object" },
        returnFlight: { type: "object" },
        departureTravelClass: { type: "string" },
        returnTravelClass: { type: "string" },
        basePrice: { type: "number" },
        taxesAndFeesPrice: { type: "number" },
        totalPrice: { type: "number" },
      },
      required: [
        "departFlight",
        "departureTravelClass",
        "basePrice",
        "taxesAndFeesPrice",
        "totalPrice",
      ],
      additionalProperties: false,
    },
    seatDetails: {
      type: "object",
      properties: {
        departSeat: { type: "string" },
        returnSeat: { type: "string" },
      },
      required: ["departSeat"],
      additionalProperties: false,
    },
    ticketHolderDetails: {
      type: "object",
      properties: {
        firstName: { type: "string" },
        lastName: { type: "string" },
        dateOfBirth: { type: "string" },
        documentId: { type: "number", nullable: true },
        documentType: { type: "string" },
        documentNumber: { type: "string" },
        documentIssuingDate: { type: "string" },
        documentExpirationDate: { type: "string" },
      },
      required: [
        "firstName",
        "lastName",
        "dateOfBirth",
        "documentId",
        "documentType",
        "documentNumber",
        "documentIssuingDate",
        "documentExpirationDate",
      ],
      additionalProperties: false,
    },
    paymentDetails: {
      type: "object",
      properties: {
        cardNumber: { type: "string" },
        paymentTimestamp: { type: "string" },
      },
      required: ["cardNumber", "paymentTimestamp"],
      additionalProperties: false,
    },
  },
  required: [
    "email",
    "bookingNumber",
    "flightDetails",
    "seatDetails",
    "ticketHolderDetails",
    "paymentDetails",
  ],
  additionalProperties: false,
});

export { BookingConfirmationValidator };
