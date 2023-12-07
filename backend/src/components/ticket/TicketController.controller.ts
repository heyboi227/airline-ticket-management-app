import BaseController from "../../common/BaseController";
import { Request, Response } from "express";
import {
  AddTicketValidator,
  AddTicketDto,
  FlightIdSeatNumberSearchDto,
} from "./dto/AddTicket.dto";
import { DefaultTicketAdapterOptions } from "./TicketService.service";
import StatusError from "../../common/StatusError";
import EmailController from "../email/EmailController.controller";
import escapeHTML = require("escape-html");
import {
  BookingConfirmationDto,
  BookingConfirmationValidator,
} from "./dto/BookingConfirmation.dto";

export default class TicketController extends BaseController {
  emailController: EmailController = new EmailController(this.services);

  getById(req: Request, res: Response) {
    const ticketId: number = +req.params?.tid;

    this.services.ticket
      .getById(ticketId, DefaultTicketAdapterOptions)
      .then((result) => {
        if (req.authorization?.role === "user") {
          if (req.authorization?.id !== result.userId) {
            throw new StatusError(
              403,
              "You do not have access to this resource!"
            );
          }
        }

        if (result === null) {
          throw new StatusError(404, "The ticket is not found!");
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
            throw new StatusError(
              403,
              "You do not have access to this resource!"
            );
          }
        }

        if (result === null) {
          throw new StatusError(404, "The ticket is not found!");
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

    if (
      req.authorization?.role === "user" &&
      req.authorization?.id !== userId
    ) {
      throw new StatusError(403, "You do not have access to this resource!");
    }

    this.services.ticket
      .getAllByUserId(userId)
      .then((result) => {
        if (result === null) {
          throw new StatusError(404, "The tickets are not found!");
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
      .getAllByFlightId(flightId)
      .then((result) => {
        if (result === null) {
          throw new StatusError(404, "The tickets are not found!");
        }

        res.send(result);
      })
      .catch((error) => {
        setTimeout(() => {
          res.status(error?.status ?? 500).send(error?.message);
        }, 500);
      });
  }

  getAllByFlightIdAndSeatNumber(req: Request, res: Response) {
    const data = req.body as FlightIdSeatNumberSearchDto;

    this.services.ticket
      .getAllByFlightIdAndSeatNumber({
        flight_id: data.flightId,
        seat_number: data.seatNumber,
      })
      .then((result) => {
        res.send(result);
      })
      .catch((error) => {
        res.status(500).send(error?.message);
      });
  }

  add(req: Request, res: Response) {
    const body = req.body as AddTicketDto;

    if (!AddTicketValidator(body)) {
      const safeOutput = escapeHTML(JSON.stringify(AddTicketValidator.errors));
      return res.status(400).send(safeOutput);
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
          flight_fare_code: body.flightFareCode,
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

  bookingConfirmationEmailSend(req: Request, res: Response) {
    const data = req.body as BookingConfirmationDto;

    if (!BookingConfirmationValidator(data)) {
      const safeOutput = escapeHTML(
        JSON.stringify(BookingConfirmationValidator.errors)
      );
      return res.status(400).send(safeOutput);
    }

    this.services.user
      .startTransaction()
      .then(() => {
        return this.emailController.sendBookingConfirmationEmail(data);
      })
      .then(() => {
        res.send({
          message: "Sent",
        });
      })
      .catch(async (error) => {
        await this.services.user.rollbackChanges();
        setTimeout(() => {
          res.status(error?.status ?? 500).send(error?.message);
        }, 500);
      });
  }
}
