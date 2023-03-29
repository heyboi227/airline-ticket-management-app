import { Request, Response } from "express";
import BaseController from "../../common/BaseController";
import { DefaultFlightLegAdapterOptions } from "./FlightLegService.service";
import {
  AddFlightLegValidator,
  IAddFlightLegDto,
} from "./dto/IAddFlightLeg.dto";
import {
  EditFlightLegValidator,
  IEditFlightLegDto,
} from "./dto/IEditFlightLeg.dto";
import FlightModel from "../flight/FlightModel.model";
import FlightLegModel from "./FlightLegModel.model";

export default class FlightLegController extends BaseController {
  async getAllFlightLegsByFlightId(req: Request, res: Response) {
    const flightId: number = +req.params?.fid;

    this.services.flight
      .getById(flightId, { loadIngredients: false })
      .then((result) => {
        if (result === null) {
          return res.status(404).send("Flight not found!");
        }

        this.services.flightLeg
          .getAllByFlightId(flightId, DefaultFlightLegAdapterOptions)
          .then((result) => {
            res.send(result);
          })
          .catch((error) => {
            res.status(500).send(error?.message);
          });
      })
      .catch((error) => {
        res.status(500).send(error?.message);
      });
  }

  async getFlightLegById(req: Request, res: Response) {
    const flightId: number = +req.params?.fid;
    const flightLegId: number = +req.params?.flid;

    this.services.flight
      .getById(flightId, { loadIngredients: false })
      .then((result) => {
        if (result === null) {
          return res.status(404).send("Flight not found!");
        }

        this.services.flightLeg
          .getById(flightLegId, DefaultFlightLegAdapterOptions)
          .then((result) => {
            if (result === null) {
              return res.status(404).send("Flight leg not found!");
            }

            if (result.flightId !== flightId) {
              return res
                .status(404)
                .send("Flight leg not found in this flight!");
            }

            res.send(result);
          })
          .catch((error) => {
            res.status(500).send(error?.message);
          });
      })
      .catch((error) => {
        res.status(500).send(error?.message);
      });
  }

  async add(req: Request, res: Response) {
    const flightId: number = +req.params?.fid;
    const data = req.body as IAddFlightLegDto;

    if (!AddFlightLegValidator(data)) {
      return res.status(400).send(AddFlightLegValidator.errors);
    }

    this.services.flight
      .getById(flightId, {})
      .then((resultFlight) => {
        if (resultFlight === null) {
          throw {
            status: 404,
            message: "Flight not found!",
          };
        }

        return this.services.bag.getAll({});
      })
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
        return this.services.flightLeg.startTransaction();
      })
      .then(() => {
        return this.services.flightLeg.add({
          flight_code: data.flightCode,
          origin_airport_id: data.originAirportId,
          destination_airport_id: data.destinationAirportId,
          departure_date_and_time: data.departureDateAndTime,
          arrival_date_and_time: data.arrivalDateAndTime,
          aircraft_id: data.aircraftId,
          flight_id: flightId,
        });
      })
      .then((newFlightLeg) => {
        for (let givenBagInformation of data.bags) {
          this.services.flightLeg
            .addFlightLegBag({
              flight_leg_id: newFlightLeg.flightLegId,
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

        return newFlightLeg;
      })
      .then((newFlightLeg) => {
        for (let givenTravelClassInformation of data.travelClasses) {
          this.services.flightLeg
            .addFlightLegTravelClass({
              flight_leg_id: newFlightLeg.flightLegId,
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

        return newFlightLeg;
      })
      .then((newFlightLeg) => {
        return this.services.flightLeg.getById(
          newFlightLeg.flightLegId,
          DefaultFlightLegAdapterOptions
        );
      })
      .then(async (result) => {
        await this.services.flightLeg.commitChanges();
        res.send(result);
      })
      .catch(async (error) => {
        await this.services.flightLeg.rollbackChanges();
        res.status(error?.status ?? 500).send(error?.message);
      });
  }

  async edit(req: Request, res: Response) {
    const flightId: number = +req.params?.fid;

    const data = req.body as IEditFlightLegDto;

    if (!EditFlightLegValidator(data)) {
      return res.status(400).send(EditFlightLegValidator.errors);
    }

    this.services.flight
      .getById(flightId, {})
      .then((result) => {
        if (result === null) {
          throw {
            status: 404,
            message: "Flight not found!",
          };
        }

        return result as FlightModel;
      })
      .then(async (flight) => {
        const flightLegId: number = +req.params?.flid;

        return this.retrieveFlightLeg(flight, flightLegId);
      })
      .then(this.checkFlightLeg)
      .then(async (result) => {
        await this.services.flightLeg.startTransaction();
        return result;
      })
      .then(async (result) => {
        const currentBagIds = result.flightLeg.bags?.map(
          (bagInfo) => bagInfo.bag.bagId
        );
        console.log("Current bag IDs: " + currentBagIds);

        const currentVisibleBagIds = result.flightLeg.bags
          ?.filter((bagInfo) => bagInfo.isActive)
          .map((bagInfo) => bagInfo.bag.bagId);
        console.log("Current visible bag IDs: " + currentVisibleBagIds);

        const currentInvisibleBagIds = result.flightLeg.bags
          ?.filter((bagInfo) => !bagInfo.isActive)
          .map((bagInfo) => bagInfo.bag.bagId);
        console.log("Current invisible bag IDs: " + currentInvisibleBagIds);

        const newBagIds = data.bags?.map((bag) => bag.bagId);
        console.log("New bag IDs: " + newBagIds);

        const bagIdsToHide = currentVisibleBagIds.filter(
          (id) => !newBagIds.includes(id)
        );
        console.log("Bag IDs to hide: " + bagIdsToHide);

        const bagIdsToShow = currentInvisibleBagIds.filter((id) =>
          newBagIds.includes(id)
        );
        console.log("Bag IDs to show: " + bagIdsToShow);

        const bagIdsToAdd = newBagIds.filter(
          (id) => !currentBagIds.includes(id)
        );
        console.log("Bag IDs to add: " + bagIdsToAdd);

        const bagIdsUnion = [...new Set([...newBagIds, ...bagIdsToShow])];
        console.log("Bag IDs: " + bagIdsUnion);

        const bagIdsToEdit = bagIdsUnion.filter(
          (id) => !bagIdsToAdd.includes(id)
        );
        console.log("Bag IDs to edit: " + bagIdsToEdit);

        for (let id of bagIdsToHide) {
          await this.services.bag.hideFlightLegBag(
            result.flightLeg.flightLegId,
            id
          );
        }

        for (let id of bagIdsToShow) {
          await this.services.bag.showFlightLegBag(
            result.flightLeg.flightLegId,
            id
          );
        }

        for (let id of bagIdsToAdd) {
          const bag = data.bags?.find((bag) => bag.bagId === id);

          if (!bag) continue;

          await this.services.flightLeg.addFlightLegBag({
            flight_leg_id: result.flightLeg.flightLegId,
            bag_id: id,
            price: bag.price,
            is_active: 1,
          });
        }

        for (let id of bagIdsToEdit) {
          const bag = data.bags?.find((bag) => bag.bagId === id);

          if (!bag) continue;

          await this.services.flightLeg.editFlightLegBag({
            flight_leg_id: result.flightLeg.flightLegId,
            bag_id: id,
            price: bag.price,
          });
        }

        const currentTravelClassIds = result.flightLeg.travelClasses?.map(
          (travelClassInfo) => travelClassInfo.travelClass.travelClassId
        );
        const currentVisibleTravelClassIds = result.flightLeg.travelClasses
          ?.filter((travelClassInfo) => travelClassInfo.isActive)
          .map((travelClassInfo) => travelClassInfo.travelClass.travelClassId);
        const currentInvisibleTravelClassIds = result.flightLeg.travelClasses
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
          await this.services.travelClass.hideFlightLegTravelClass(
            result.flightLeg.flightLegId,
            id
          );
        }

        for (let id of travelClassIdsToShow) {
          await this.services.travelClass.showFlightLegTravelClass(
            result.flightLeg.flightLegId,
            id
          );
        }

        for (let id of travelClassIdsToAdd) {
          const travelClass = data.travelClasses?.find(
            (travelClass) => travelClass.travelClassId === id
          );

          if (!travelClass) continue;

          await this.services.flightLeg.addFlightLegTravelClass({
            flight_leg_id: result.flightLeg.flightLegId,
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

          await this.services.flightLeg.editFlightLegTravelClass({
            flight_leg_id: result.flightLeg.flightLegId,
            travel_class_id: id,
            price: travelClass.price,
          });
        }

        await this.services.flightLeg.edit(
          result.flightLeg.flightLegId,
          {
            flight_code: data.flightCode,
            origin_airport_id: data.originAirportId,
            destination_airport_id: data.destinationAirportId,
            departure_date_and_time: data.departureDateAndTime,
            arrival_date_and_time: data.arrivalDateAndTime,
            aircraft_id: data.aircraftId,
            flight_id: flightId,
          },
          DefaultFlightLegAdapterOptions
        );

        return result;
      })
      .then(async (result) => {
        await this.services.flightLeg.commitChanges();

        res.send(
          await this.services.flightLeg.getById(
            result.flightLeg.flightLegId,
            DefaultFlightLegAdapterOptions
          )
        );
      })
      .catch(async (error) => {
        await this.services.flightLeg.rollbackChanges();
        res.status(error?.status ?? 500).send(error?.message);
      });
  }

  private async retrieveFlightLeg(
    flight: FlightModel,
    flightLegId: number
  ): Promise<{ flight: FlightModel; flightLeg: FlightLegModel | null }> {
    return {
      flight: flight,
      flightLeg: await this.services.flightLeg.getById(flightLegId, {
        loadOriginAirport: false,
        loadDestinationAirport: false,
        loadAircraft: false,
        loadFlight: false,
        loadBags: true,
        hideInactiveBags: true,
        loadTravelClasses: true,
        hideInactiveTravelClasses: true,
      }),
    };
  }

  private checkFlightLeg(result: {
    flight: FlightModel;
    flightLeg: FlightLegModel | null;
  }): { flight: FlightModel; flightLeg: FlightLegModel } {
    if (result.flightLeg === null) {
      throw {
        status: 404,
        message: "Flight leg not found!",
      };
    }

    if (result.flightLeg.flightId !== result.flight.flightId) {
      throw {
        status: 404,
        message: "Flight leg not found in this flight!",
      };
    }

    return result;
  }

  async delete(req: Request, res: Response) {
    const flightId: number = +req.params?.fid;
    const flightLegId: number = +req.params?.flid;

    this.services.flight
      .getById(flightId, {})
      .then((result) => {
        if (result === null)
          throw { status: 404, message: "Flight not found!" };
        return result;
      })
      .then(async (flight) => {
        return {
          flight: flight,
          flightLeg: await this.services.flightLeg.getById(
            flightLegId,
            DefaultFlightLegAdapterOptions
          ),
        };
      })
      .then(({ flight, flightLeg }) => {
        if (flightLeg === null)
          throw { status: 404, message: "Flight leg not found!" };
        if (flightLeg.flightId !== flight.flightId)
          throw {
            status: 404,
            message: "Flight leg not found in this flight!",
          };
        return flightLeg;
      })
      .then((flightLeg) => {
        return this.services.flightLeg.deleteById(flightLeg.flightLegId);
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
