import IDocument from "./IDocument.model";
import IUser from "./IUser.model";
import IFlight from "./IFlight.model";

export default interface ITicket {
  ticketId: number;
  ticketNumber: string;
  ticketHolderName: string;
  documentId: number;
  price: number;
  userId: number;
  flightId: number;
  seatNumber: string;

  document?: IDocument;
  user?: IUser;
  flight?: IFlight;
}
