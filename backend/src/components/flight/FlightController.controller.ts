import BaseController from "../../common/BaseController";
import { Request, Response } from "express";
import {
  AddFlightValidator,
  IAddFlightDto,
  IFlightSearchDto,
} from "./dto/IAddFlight.dto";
import { EditFlightValidator, IEditFlightDto } from "./dto/IEditFlight.dto";
import { DefaultFlightAdapterOptions } from "./FlightService.service";
import FlightModel from "./FlightModel.model";

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

  getByFlightCode(req: Request, res: Response) {
    const flightCode: string = req.params?.fcode;

    this.services.flight
      .getByFlightCode(flightCode)
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

  getAllBySearchQuery(req: Request, res: Response) {
    const searchData = req.body as IFlightSearchDto;

    this.services.flight
      .getAllBySearchQuery({
        origin_airport_id: searchData.originAirportId,
        destination_airport_id: searchData.destinationAirportId,
        departure_date_and_time: searchData.departureDateAndTime,
        return_date_and_time: searchData.returnDateAndTime,
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
      return res.status(400).send(AddFlightValidator.errors);
    }

    this.services.bag
      .getAll({})
      .then((bags) => {
        const availableBagIds: number[] = bags.map((bag) => bag.bagId);

        for (let givenBagInformation of data.bags) {
          if (!availableBagIds.includes(givenBagInformation.bagId)) {
            throw {
              status: 404,
              message: `Bag with ID ${givenBagInformation.bagId} not found!`,
            };
          }
        }

        return this.services.travelClass.getAll({});
      })
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
            throw {
              status: 404,
              message: `Travel class with ID ${givenTravelClassInformation.travelClassId} not found!`,
            };
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
        for (let givenBagInformation of data.bags) {
          this.services.flight
            .addFlightBag({
              flight_id: newFlight.flightId,
              bag_id: givenBagInformation.bagId,
              price: givenBagInformation.price,
              is_active: 1,
            })
            .catch((error) => {
              throw {
                status: 500,
                message: error?.message,
              };
            });
        }

        return newFlight;
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
              throw {
                status: 500,
                message: error?.message,
              };
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
        res.status(error?.status ?? 500).send(error?.message);
      });
  }

  async edit(req: Request, res: Response) {
    const flightId: number = +req.params?.fid;

    const data = req.body as IEditFlightDto;

    if (!EditFlightValidator(data)) {
      return res.status(400).send(EditFlightValidator.errors);
    }

    this.services.flight
      .getById(flightId, DefaultFlightAdapterOptions)
      .then((result) => {
        if (result === null) {
          throw {
            status: 404,
            message: "Flight not found!",
          };
        }

        return result as FlightModel;
      })
      .then(async (result) => {
        await this.services.flight.startTransaction();
        return result;
      })
      .then(async (result) => {
        const currentBagIds = result.bags?.map((bagInfo) => bagInfo.bag.bagId);

        const currentVisibleBagIds = result.bags
          ?.filter((bagInfo) => bagInfo.isActive)
          .map((bagInfo) => bagInfo.bag.bagId);

        const currentInvisibleBagIds = result.bags
          ?.filter((bagInfo) => !bagInfo.isActive)
          .map((bagInfo) => bagInfo.bag.bagId);

        const newBagIds = data.bags?.map((bag) => bag.bagId);

        const bagIdsToHide = currentVisibleBagIds.filter(
          (id) => !newBagIds.includes(id)
        );

        const bagIdsToShow = currentInvisibleBagIds.filter((id) =>
          newBagIds.includes(id)
        );

        const bagIdsToAdd = newBagIds.filter(
          (id) => !currentBagIds.includes(id)
        );

        const bagIdsUnion = [...new Set([...newBagIds, ...bagIdsToShow])];

        const bagIdsToEdit = bagIdsUnion.filter(
          (id) => !bagIdsToAdd.includes(id)
        );

        for (let id of bagIdsToHide) {
          await this.services.bag.hideFlightBag(result.flightId, id);
        }

        for (let id of bagIdsToShow) {
          await this.services.bag.showFlightBag(result.flightId, id);
        }

        for (let id of bagIdsToAdd) {
          const bag = data.bags?.find((bag) => bag.bagId === id);

          if (!bag) continue;

          await this.services.flight.addFlightBag({
            flight_id: result.flightId,
            bag_id: id,
            price: bag.price,
            is_active: 1,
          });
        }

        for (let id of bagIdsToEdit) {
          const bag = data.bags?.find((bag) => bag.bagId === id);

          if (!bag) continue;

          await this.services.flight.editFlightBag({
            flight_id: result.flightId,
            bag_id: id,
            price: bag.price,
          });
        }

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
        const travelClassIdsToShow = currentInvisibleTravelClassIds.filter(
          (id) => newTravelClassIds.includes(id)
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

        for (let id of travelClassIdsToHide) {
          await this.services.travelClass.hideFlightTravelClass(
            result.flightId,
            id
          );
        }

        for (let id of travelClassIdsToShow) {
          await this.services.travelClass.showFlightTravelClass(
            result.flightId,
            id
          );
        }

        for (let id of travelClassIdsToAdd) {
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

        for (let id of travelClassIdsToEdit) {
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

        await this.services.flight.editById(result.flightId, {
          flight_code: data.flightCode,
          origin_airport_id: data.originAirportId,
          destination_airport_id: data.destinationAirportId,
          departure_date_and_time: data.departureDateAndTime,
          arrival_date_and_time: data.arrivalDateAndTime,
          aircraft_id: data.aircraftId,
        });

        return result;
      })
      .then(async (result) => {
        await this.services.flight.commitChanges();

        res.send(
          await this.services.flight.getById(
            result.flightId,
            DefaultFlightAdapterOptions
          )
        );
      })
      .catch(async (error) => {
        await this.services.flight.rollbackChanges();
        res.status(error?.status ?? 500).send(error?.message);
      });
  }

  async delete(req: Request, res: Response) {
    const flightId: number = +req.params?.fid;

    this.services.flight
      .getById(flightId, DefaultFlightAdapterOptions)
      .then((result) => {
        if (result === null)
          throw { status: 404, message: "Flight not found!" };
        return result;
      })
      .then(async () => {
        const flight = await this.services.flight.getById(
          flightId,
          DefaultFlightAdapterOptions
        );
        return flight;
      })
      .then((flight) => {
        if (flight === null)
          throw { status: 404, message: "Flight not found!" };
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
