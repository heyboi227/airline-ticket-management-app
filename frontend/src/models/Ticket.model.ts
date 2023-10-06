import UserDocument from "./UserDocument.model";
import User from "./User.model";
import Flight from "./Flight.model";

export default interface Ticket {
  ticketId: number;
  ticketNumber: string;
  ticketHolderName: string;
  documentId: number;
  price: number;
  userId: number;
  flightId: number;
  flightFareCode: string;
  seatNumber: string;

  document?: UserDocument;
  user?: User;
  flight?: Flight;
}
