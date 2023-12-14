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
  passengers: {
    firstName: string;
    lastName: string;
    dateOfBirth: string;
    userDocumentId: number;
    documentType: "Passport" | "National ID";
    documentNumber: string;
    documentCountryId: number;
    documentIssuingDate: string;
    documentExpirationDate: string;
    gender: "Male" | "Female";
    departSeat: string;
    returnSeat?: string;
  }[];
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
    passengers: {
      type: "array",
      items: {
        type: "object",
        properties: {
          firstName: { type: "string" },
          lastName: { type: "string" },
          dateOfBirth: { type: "string" },
          userDocumentId: { type: "integer" },
          documentType: { type: "string", enum: ["Passport", "National ID"] },
          documentNumber: { type: "string" },
          documentCountryId: { type: "integer" },
          documentIssuingDate: { type: "string" },
          documentExpirationDate: { type: "string" },
          gender: { type: "string", enum: ["Male", "Female"] },
          departSeat: { type: "string" },
          returnSeat: { type: "string" },
        },
        required: [
          "firstName",
          "lastName",
          "dateOfBirth",
          "userDocumentId",
          "documentType",
          "documentNumber",
          "documentCountryId",
          "documentIssuingDate",
          "documentExpirationDate",
          "gender",
          "departSeat",
        ],
      },
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
    "passengers",
    "paymentDetails",
  ],
  additionalProperties: false,
});

export { BookingConfirmationValidator };
