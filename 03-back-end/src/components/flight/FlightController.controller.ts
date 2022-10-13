import BaseController from "../../common/BaseController";
import { Request, Response } from "express";
import { AddFlightValidator, IAddFlightDto } from "./dto/IAddFlight.dto";
import { EditFlightValidator, IEditFlightDto } from "./dto/IEditFlight.dto";
import { DefaultFlightAdapterOptions } from "./FlightService.service";

export default class FlightController extends BaseController {
  getAll(_req: Request, res: Response) {
    this.services.flight
      .getAll(DefaultFlightAdapterOptions)
      .then((result) => {
        res.send(result);
      })
      .catch((error) => {
        setTimeout(() => {
          res.status(500).send(error?.message);
        }, 300);
      });
  }

  getById(req: Request, res: Response) {
    const flightId: number = +req.params?.fid;

    this.services.flight
      .getById(flightId, DefaultFlightAdapterOptions)
      .then((result) => {
        if (result === null) {
          throw {
            status: 404,
            message: "The flight is not found!",
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

  getByFlightFareCode(req: Request, res: Response) {
    const flightFareCode: string = req.params?.fcode;

    this.services.flight
      .getByFlightFareCode(flightFareCode)
      .then((result) => {
        if (result === null) {
          throw {
            status: 404,
            message: "The flight is not found!",
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

  add(req: Request, res: Response) {
    const body = req.body as IAddFlightDto;

    if (!AddFlightValidator(body)) {
      return res.status(400).send(AddFlightValidator.errors);
    }

    this.services.flight
      .startTransaction()
      .then(() => {
        return this.services.flight.add({
          flight_fare_code: body.flightFareCode,
        });
      })
      .then(async (result) => {
        await this.services.flight.commitChanges();
        res.send(result);
      })
      .catch(async (error) => {
        await this.services.flight.rollbackChanges();
        setTimeout(() => {
          res.status(500).send(error?.message);
        }, 300);
      });
  }

  editById(req: Request, res: Response) {
    const flightId: number = +req.params?.fid;
    const data = req.body as IEditFlightDto;

    if (!EditFlightValidator(data)) {
      return res.status(400).send(EditFlightValidator.errors);
    }

    this.services.flight
      .startTransaction()
      .then(() => {
        return this.services.flight.editById(flightId, {
          flight_fare_code: data.flightFareCode,
        });
      })
      .then(async (result) => {
        await this.services.flight.commitChanges();
        res.send(result);
      })
      .catch(async (error) => {
        await this.services.flight.rollbackChanges();
        setTimeout(() => {
          res.status(500).send(error?.message);
        }, 300);
      });
  }
}
