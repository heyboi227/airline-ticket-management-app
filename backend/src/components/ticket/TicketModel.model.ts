import Model from "../../common/Model.interface";
import DocumentModel from "../document/DocumentModel.model";
import FlightModel from "../flight/FlightModel.model";
import UserModel from "../user/UserModel.model";

export default class TicketModel implements Model {
  ticketId: number;
  ticketNumber: string;
  ticketHolderName: string;
  documentId: number;
  price: number;
  userId: number;
  flightId: number;
  flightFareCode: string;
  seatNumber: string;

  document?: DocumentModel;
  user?: UserModel;
  flight?: FlightModel;
}
