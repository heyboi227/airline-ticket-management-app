import Ajv from "ajv";
import addFormats from "ajv-formats";

const ajv = new Ajv();
addFormats(ajv);

export interface BookingConfirmationDto {
  email: string;
  bookingNumber: string;
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
  },
  required: ["email", "bookingNumber"],
  additionalProperties: false,
});

export { BookingConfirmationValidator };
