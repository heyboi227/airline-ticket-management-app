import BaseController from "../../common/BaseController";
import { Request, Response } from "express";
import {
  AddFlightValidator,
  IAddFlightDto,
  IFlightDepartureSearchDto,
  IFlightReturnSearchDto,
} from "./dto/IAddFlight.dto";
import {
  EditFlightValidator,
  IEditFlight,
  IEditFlightDto,
} from "./dto/IEditFlight.dto";
import { DefaultFlightAdapterOptions } from "./FlightService.service";
import FlightModel from "./FlightModel.model";
import StatusError from "../../common/StatusError";
import escapeHTML = require("escape-html");

type TravelClassIds = {
  toHide: number[];
  toShow: number[];
  toAdd: number[];
  toEdit: number[];
};

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
          throw new StatusError(404, "The flight is not found!");
        }

        res.send(result);
      })
      .catch((error) => {
        setTimeout(() => {
          res.status(error?.status ?? 500).send(error?.message);
        }, 300);
      });
  }

  getByFlightCode(req: Request, res: Response) {
    const flightCode: string = req.params?.fcode;

    this.services.flight
      .getByFlightCode(flightCode)
      .then((result) => {
        if (result === null) {
          throw new StatusError(404, "The flight is not found!");
        }

        res.send(result);
      })
      .catch((error) => {
        setTimeout(() => {
          res.status(error?.status ?? 500).send(error?.message);
        }, 300);
      });
  }

  getAllByDepartureDateSearchQuery(req: Request, res: Response) {
    const searchData = req.body as IFlightDepartureSearchDto;

    this.services.flight
      .getAllByDepartureDateSearchQuery({
        origin_airport_id: searchData.originAirportId,
        destination_airport_id: searchData.destinationAirportId,
        departure_date: searchData.departureDate,
      })
      .then((result) => {
        res.send(result);
      })
      .catch((error) => {
        res.status(500).send(error?.message);
      });
  }

  getAllByReturnDateSearchQuery(req: Request, res: Response) {
    const searchData = req.body as IFlightReturnSearchDto;

    this.services.flight
      .getAllByReturnDateSearchQuery({
        origin_airport_id: searchData.originAirportId,
        destination_airport_id: searchData.destinationAirportId,
        return_date: searchData.returnDate,
      })
      .then((result) => {
        res.send(result);
      })
      .catch((error) => {
        res.status(500).send(error?.message);
      });
  }

  async add(req: Request, res: Response) {
    const data = req.body as IAddFlightDto;

    if (!AddFlightValidator(data)) {
      const safeOutput = escapeHTML(JSON.stringify(AddFlightValidator.errors));
      return res.status(400).send(safeOutput);
    }

    this.services.travelClass
      .getAll({})
      .then((travelClasses) => {
        const availableTravelClassIds: number[] = travelClasses.map(
          (travelClass) => travelClass.travelClassId
        );

        for (let givenTravelClassInformation of data.travelClasses) {
          if (
            !availableTravelClassIds.includes(
              givenTravelClassInformation.travelClassId
            )
          ) {
            throw new StatusError(
              404,
              `Travel class with ID ${givenTravelClassInformation.travelClassId} not found!`
            );
          }
        }

        return this.services.travelClass.getAll({});
      })
      .then(() => {
        return this.services.flight.startTransaction();
      })
      .then(() => {
        return this.services.flight.add({
          flight_code: data.flightCode,
          origin_airport_id: data.originAirportId,
          destination_airport_id: data.destinationAirportId,
          departure_date_and_time: data.departureDateAndTime,
          arrival_date_and_time: data.arrivalDateAndTime,
          aircraft_id: data.aircraftId,
        });
      })
      .then((newFlight) => {
        for (let givenTravelClassInformation of data.travelClasses) {
          this.services.flight
            .addFlightTravelClass({
              flight_id: newFlight.flightId,
              travel_class_id: givenTravelClassInformation.travelClassId,
              price: givenTravelClassInformation.price,
              is_active: 1,
            })
            .catch((error) => {
              throw new StatusError(500, error?.message);
            });
        }

        return newFlight;
      })
      .then((newFlight) => {
        return this.services.flight.getById(
          newFlight.flightId,
          DefaultFlightAdapterOptions
        );
      })
      .then(async (result) => {
        await this.services.flight.commitChanges();
        res.send(result);
      })
      .catch(async (error) => {
        await this.services.flight.rollbackChanges();
        const safeOutput = escapeHTML(error?.message);
        res.status(error?.status ?? 500).send(safeOutput);
      });
  }

  async edit(req: Request, res: Response) {
    const flightId: number = +req.params?.fid;

    const data = req.body as IEditFlightDto;

    if (!EditFlightValidator(data)) {
      const safeOutput = escapeHTML(JSON.stringify(EditFlightValidator.errors));
      return res.status(400).send(safeOutput);
    }

    try {
      const result = await this.services.flight.getById(
        flightId,
        DefaultFlightAdapterOptions
      );

      if (result === null) {
        throw new StatusError(404, "Flight not found!");
      }

      const serviceData: IEditFlight = {};

      if (data.flightCode !== undefined) {
        serviceData.flight_code = data.flightCode;
      }

      if (data.originAirportId !== undefined) {
        serviceData.origin_airport_id = data.originAirportId;
      }

      if (data.destinationAirportId !== undefined) {
        serviceData.destination_airport_id = data.destinationAirportId;
      }

      if (data.departureDateAndTime !== undefined) {
        serviceData.departure_date_and_time = data.departureDateAndTime;
      }

      if (data.arrivalDateAndTime !== undefined) {
        serviceData.arrival_date_and_time = data.arrivalDateAndTime;
      }

      if (data.aircraftId !== undefined) {
        serviceData.aircraft_id = data.aircraftId;
      }

      await this.services.flight.startTransaction();

      if (data.travelClasses !== undefined) {
        const travelClassIds = this.getTravelClassIds(result, data);
        await this.updateTravelClasses(result, data, travelClassIds);
      }

      await this.services.flight.editById(result.flightId, serviceData);

      await this.services.flight.commitChanges();

      res.send(
        await this.services.flight.getById(
          result.flightId,
          DefaultFlightAdapterOptions
        )
      );
    } catch (error) {
      await this.services.flight.rollbackChanges();
      res.status(error?.status ?? 500).send(error?.message);
    }
  }

  private getTravelClassIds(
    result: FlightModel,
    data: IEditFlightDto
  ): TravelClassIds {
    const currentTravelClassIds = result.travelClasses?.map(
      (travelClassInfo) => travelClassInfo.travelClass.travelClassId
    );
    const currentVisibleTravelClassIds = result.travelClasses
      ?.filter((travelClassInfo) => travelClassInfo.isActive)
      .map((travelClassInfo) => travelClassInfo.travelClass.travelClassId);
    const currentInvisibleTravelClassIds = result.travelClasses
      ?.filter((travelClassInfo) => !travelClassInfo.isActive)
      .map((travelClassInfo) => travelClassInfo.travelClass.travelClassId);

    const newTravelClassIds = data.travelClasses?.map(
      (travelClass) => travelClass.travelClassId
    );

    const travelClassIdsToHide = currentVisibleTravelClassIds.filter(
      (id) => !newTravelClassIds.includes(id)
    );
    const travelClassIdsToShow = currentInvisibleTravelClassIds.filter((id) =>
      newTravelClassIds.includes(id)
    );
    const travelClassIdsToAdd = newTravelClassIds.filter(
      (id) => !currentTravelClassIds.includes(id)
    );
    const travelClassIdsUnion = [
      ...new Set([...newTravelClassIds, ...travelClassIdsToShow]),
    ];
    const travelClassIdsToEdit = travelClassIdsUnion.filter(
      (id) => !travelClassIdsToAdd.includes(id)
    );

    return {
      toHide: travelClassIdsToHide,
      toShow: travelClassIdsToShow,
      toAdd: travelClassIdsToAdd,
      toEdit: travelClassIdsToEdit,
    };
  }

  private async updateTravelClasses(
    result: FlightModel,
    data: IEditFlightDto,
    travelClassIds: {
      toHide: number[];
      toShow: number[];
      toAdd: number[];
      toEdit: number[];
    }
  ) {
    for (let id of travelClassIds.toHide) {
      await this.services.travelClass.hideFlightTravelClass(
        result.flightId,
        id
      );
    }

    for (let id of travelClassIds.toShow) {
      await this.services.travelClass.showFlightTravelClass(
        result.flightId,
        id
      );
    }

    for (let id of travelClassIds.toAdd) {
      const travelClass = data.travelClasses?.find(
        (travelClass) => travelClass.travelClassId === id
      );

      if (!travelClass) continue;

      await this.services.flight.addFlightTravelClass({
        flight_id: result.flightId,
        travel_class_id: id,
        price: travelClass.price,
        is_active: 1,
      });
    }

    for (let id of travelClassIds.toEdit) {
      const travelClass = data.travelClasses?.find(
        (travelClass) => travelClass.travelClassId === id
      );

      if (!travelClass) continue;

      await this.services.flight.editFlightTravelClass({
        flight_id: result.flightId,
        travel_class_id: id,
        price: travelClass.price,
      });
    }
  }

  async delete(req: Request, res: Response) {
    const flightId: number = +req.params?.fid;

    this.services.flight
      .getById(flightId, DefaultFlightAdapterOptions)
      .then((result) => {
        if (result === null) throw new StatusError(404, "Flight not found!");
      })
      .then(async () => {
        const flight = await this.services.flight.getById(
          flightId,
          DefaultFlightAdapterOptions
        );
        return flight;
      })
      .then((flight) => {
        if (flight === null) throw new StatusError(404, "Flight not found!");
        return flight;
      })
      .then((flight) => {
        return this.services.flight.deleteById(flight.flightId);
      })
      .then(() => {
        res.send("Deleted!");
      })
      .catch((error) => {
        res
          .status(error?.status ?? 500)
          .send(error?.message ?? "Server side error!");
      });
  }
}
