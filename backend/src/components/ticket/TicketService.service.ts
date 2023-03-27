import BaseService from "../../common/BaseService";
import IAdapterOptions from "../../common/IAdapterOptions.interface";
import TicketModel from "./TicketModel.model";
import { IAddTicket } from "./dto/IAddTicket.dto";
import { DefaultDocumentAdapterOptions } from "../document/DocumentService.service";
import { DefaultFlightAdapterOptions } from "../flight/FlightService.service";

export interface ITicketAdapterOptions extends IAdapterOptions {
  showDocument: boolean;
  showUser: boolean;
  showFlight: boolean;
}

export const DefaultTicketAdapterOptions: ITicketAdapterOptions = {
  showDocument: true,
  showUser: true,
  showFlight: true,
};

export default class TicketService extends BaseService<
  TicketModel,
  ITicketAdapterOptions
> {
  tableName(): string {
    return "ticket";
  }

  protected async adaptToModel(
    data: any,
    options: ITicketAdapterOptions
  ): Promise<TicketModel> {
    const ticket = new TicketModel();

    ticket.ticketId = +data?.ticket_id;
    ticket.ticketNumber = data?.ticket_number;
    ticket.ticketHolderName = data?.ticket_holder_name;
    ticket.documentId = +data?.document_id;
    ticket.price = +data?.price;
    ticket.userId = +data?.user_id;
    ticket.flightId = +data?.flight_id;
    ticket.seatNumber = data?.seat_number;

    if (options.showDocument) {
      ticket.document = await this.services.document.getById(
        ticket.documentId,
        DefaultDocumentAdapterOptions
      );
    }

    if (options.showUser) {
      ticket.user = await this.services.user.getById(ticket.userId, {
        removeActivationCode: true,
        removePassword: true,
      });
    }

    if (options.showFlight) {
      ticket.flight = await this.services.flight.getById(
        ticket.flightId,
        DefaultFlightAdapterOptions
      );
    }

    return ticket;
  }

  public async add(data: IAddTicket): Promise<TicketModel> {
    return this.baseAdd(data, DefaultTicketAdapterOptions);
  }

  public async getByTicketNumber(
    ticketNumber: string
  ): Promise<TicketModel | null> {
    return new Promise((resolve, reject) => {
      this.getAllByFieldNameAndValue(
        "ticket_number",
        ticketNumber,
        DefaultTicketAdapterOptions
      )
        .then((result) => {
          if (result.length === 0) {
            return resolve(null);
          }

          resolve(result[0]);
        })
        .catch((error) => {
          reject(error?.message);
        });
    });
  }

  public async getAllByUserId(
    userId: number,
    options: ITicketAdapterOptions = DefaultTicketAdapterOptions
  ): Promise<TicketModel[]> {
    return this.getAllByFieldNameAndValue("user_id", userId, options);
  }

  public async getAllByFlightId(
    flightId: number,
    options: ITicketAdapterOptions = DefaultTicketAdapterOptions
  ): Promise<TicketModel[]> {
    return this.getAllByFieldNameAndValue("flight_id", flightId, options);
  }
}
