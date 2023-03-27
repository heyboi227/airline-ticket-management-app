import { Request, Response } from "express";
import BaseController from "../../common/BaseController";
import {
  AddFlightLegValidator,
  IAddFlightLegDto,
} from "./dto/IAddFlightLeg.dto";
import {
  EditFlightLegValidator,
  IEditFlightLegDto,
} from "./dto/IEditFlightLeg.dto";
import { DefaultFlightLegAdapterOptions } from "./FlightLegService.service";

export default class FlightLegController extends BaseController {
  getAll(_req: Request, res: Response) {
    this.services.flightLeg
      .getAll(DefaultFlightLegAdapterOptions)
      .then((result) => {
        res.send(result);
      })
      .catch((error) => {
        res.status(500).send(error?.message ?? "Internal server error!");
      });
  }

  getById(req: Request, res: Response) {
    const flightLegId: number = +req.params?.flid;

    this.services.flightLeg
      .getById(flightLegId, DefaultFlightLegAdapterOptions)
      .then((result) => {
        if (result === null) {
          throw {
            status: 404,
            message: "Flight leg not found!",
          };
        }

        return result;
      })
      .then((result) => {
        res.send(result);
      })
      .catch((error) => {
        res
          .status(error?.status ?? 500)
          .send(error?.message ?? "Internal server error!");
      });
  }

  add(req: Request, res: Response) {
    const data = req.body as IAddFlightLegDto;

    if (!AddFlightLegValidator(data)) {
      return res.status(400).send(AddFlightLegValidator.errors);
    }

    this.services.flightLeg
      .add({
        flight_code: data.flightCode,
        origin_airport_id: data.originAirportId,
        destination_airport_id: data.destinationAirportId,
        departure_date_and_time: data.departureDateAndTime,
        arrival_date_and_time: data.arrivalDateAndTime,
        aircraft_id: data.aircraftId,
      })
      .then((result) => {
        if (result === null) {
          throw {
            status: 400,
            message: "Bad travel class data given!",
          };
        }

        return result;
      })
      .then((result) => {
        res.send(result);
      })
      .catch((error) => {
        res
          .status(error?.status ?? 500)
          .send(error?.message ?? "Internal server error!");
      });
  }

  editById(req: Request, res: Response) {
    const flightLegId: number = +req.params?.flid;
    const data = req.body as IEditFlightLegDto;

    if (!EditFlightLegValidator(data)) {
      return res.status(400).send(EditFlightLegValidator.errors);
    }

    this.services.flightLeg
      .getById(flightLegId, DefaultFlightLegAdapterOptions)
      .then((result) => {
        if (result === null) {
          throw {
            status: 404,
            message: "Travel class not found!",
          };
        }
      })
      .then(() => {
        return this.services.flightLeg.editById(flightLegId, {
          flight_code: data.flightCode,
          origin_airport_id: data.originAirportId,
          destination_airport_id: data.destinationAirportId,
          departure_date_and_time: data.departureDateAndTime,
          arrival_date_and_time: data.arrivalDateAndTime,
          aircraft_id: data.aircraftId,
        });
      })
      .then((flightLeg) => {
        res.send(flightLeg);
      })
      .catch((error) => {
        res
          .status(error?.status ?? 500)
          .send(error?.message ?? "Internal server error!");
      });
  }
}
