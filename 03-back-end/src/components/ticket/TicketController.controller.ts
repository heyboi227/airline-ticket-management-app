import BaseController from "../../common/BaseController";
import { Request, Response } from "express";
import { AddTicketValidator, IAddTicketDto } from "./dto/IAddTicket.dto";
import { DefaultTicketAdapterOptions } from "./TicketService.service";

export default class TicketController extends BaseController {
  getById(req: Request, res: Response) {
    const ticketId: number = +req.params?.tid;

    this.services.ticket
      .getById(ticketId, DefaultTicketAdapterOptions)
      .then((result) => {
        if (req.authorization?.role === "user") {
          if (req.authorization?.id !== result.userId) {
            throw {
              status: 403,
              message: "You do not have access to this resource!",
            };
          }
        }

        if (result === null) {
          throw {
            status: 404,
            message: "The ticket is not found!",
          };
        }

        res.send(result);
      })
      .catch((error) => {
        setTimeout(() => {
          res.status(error?.status ?? 500).send(error?.message);
        }, 300);
      });
  }

  getByTicketNumber(req: Request, res: Response) {
    const ticketNumber: string = req.params?.tnum;

    this.services.ticket
      .getByTicketNumber(ticketNumber)
      .then((result) => {
        if (req.authorization?.role === "user") {
          if (req.authorization?.id !== result.userId) {
            throw {
              status: 403,
              message: "You do not have access to this resource!",
            };
          }
        }

        if (result === null) {
          throw {
            status: 404,
            message: "The ticket is not found!",
          };
        }

        res.send(result);
      })
      .catch((error) => {
        setTimeout(() => {
          res.status(error?.status ?? 500).send(error?.message);
        }, 300);
      });
  }

  getAllByUserId(req: Request, res: Response) {
    const userId: number = +req.params?.uid;

    this.services.ticket
      .getAllByUserId(userId)
      .then((result) => {
        if (result === null) {
          throw {
            status: 404,
            message: "The tickets are not found!",
          };
        }

        res.send(result);
      })
      .catch((error) => {
        setTimeout(() => {
          res.status(error?.status ?? 500).send(error?.message);
        }, 500);
      });
  }

  getAllByFlightId(req: Request, res: Response) {
    const flightId: number = +req.params?.fid;

    this.services.ticket
      .getAllByUserId(flightId)
      .then((result) => {
        if (result === null) {
          throw {
            status: 404,
            message: "The tickets are not found!",
          };
        }

        res.send(result);
      })
      .catch((error) => {
        setTimeout(() => {
          res.status(error?.status ?? 500).send(error?.message);
        }, 500);
      });
  }

  add(req: Request, res: Response) {
    const body = req.body as IAddTicketDto;

    if (!AddTicketValidator(body)) {
      return res.status(400).send(AddTicketValidator.errors);
    }

    this.services.ticket
      .startTransaction()
      .then(() => {
        return this.services.ticket.add({
          ticket_number: body.ticketNumber,
          ticket_holder_name: body.ticketHolderName,
          document_id: body.documentId,
          price: body.price,
          user_id: body.userId,
          flight_id: body.flightId,
          seat_number: body.seatNumber,
        });
      })
      .then(async (result) => {
        await this.services.ticket.commitChanges();
        res.send(result);
      })
      .catch(async (error) => {
        await this.services.ticket.rollbackChanges();
        setTimeout(() => {
          res.status(500).send(error?.message);
        }, 300);
      });
  }
}
