import BaseService from "../../common/BaseService";
import IAdapterOptions from "../../common/IAdapterOptions.interface";
import FlightLegModel from "./FlightLegModel.model";
import { DefaultAirportAdapterOptions } from "../airport/AirportService.service";
import {
  IAddFlightLeg,
  IFlightLegBag,
  IFlightLegTravelClass,
} from "./dto/IAddFlightLeg.dto";
import { IEditFlightLeg } from "./dto/IEditFlightLeg.dto";

export interface IFlightLegAdapterOptions extends IAdapterOptions {
  loadOriginAirport: boolean;
  loadDestinationAirport: boolean;
  loadAircraft: boolean;
  loadFlight: boolean;
  loadBags: boolean;
  hideInactiveBags: boolean;
  loadTravelClasses: boolean;
  hideInactiveTravelClasses: boolean;
}

export const DefaultFlightLegAdapterOptions: IFlightLegAdapterOptions = {
  loadOriginAirport: false,
  loadDestinationAirport: false,
  loadAircraft: false,
  loadFlight: false,
  loadBags: false,
  hideInactiveBags: true,
  loadTravelClasses: false,
  hideInactiveTravelClasses: true,
};

export default class FlightLegService extends BaseService<
  FlightLegModel,
  IFlightLegAdapterOptions
> {
  addFlightLegIngredient(arg0: { flightLeg_id: any; ingredient_id: any }) {
    throw new Error("Method not implemented.");
  }
  deleteFlightLegIngredient(arg0: { flightLeg_id: any; ingredient_id: any }) {
    throw new Error("Method not implemented.");
  }
  tableName(): string {
    return "flight_leg";
  }

  protected adaptToModel(
    data: any,
    options: IFlightLegAdapterOptions
  ): Promise<FlightLegModel> {
    return new Promise(async (resolve) => {
      const flightLeg = new FlightLegModel();

      flightLeg.flightLegId = +data?.flight_leg_id;
      flightLeg.flightCode = data?.flight_code;
      flightLeg.originAirportId = +data?.origin_airport_id;
      flightLeg.destinationAirportId = +data?.destination_airport_id;
      flightLeg.departureDateAndTime = data?.departure_date_and_time;
      flightLeg.arrivalDateAndTime = data?.arrival_date_and_time;
      flightLeg.aircraftId = +data?.aircraft_id;
      flightLeg.flightId = +data?.flight_id;

      if (options.loadOriginAirport) {
        flightLeg.originAirport = await this.services.airport.getById(
          flightLeg.originAirportId,
          DefaultAirportAdapterOptions
        );
      }

      if (options.loadDestinationAirport) {
        flightLeg.destinationAirport = await this.services.airport.getById(
          flightLeg.destinationAirportId,
          DefaultAirportAdapterOptions
        );
      }

      if (options.loadAircraft) {
        flightLeg.aircraft = await this.services.aircraft.getById(
          flightLeg.aircraftId,
          {}
        );
      }

      if (options.loadFlight) {
        flightLeg.flight = await this.services.flight.getById(
          flightLeg.flightId,
          {}
        );
      }

      if (options.loadBags) {
        flightLeg.bags = await this.services.bag.getAllByFlightLegId(
          flightLeg.flightLegId
        );

        if (options.hideInactiveBags) {
          flightLeg.bags = flightLeg.bags.filter((bagInfo) => bagInfo.isActive);
        }
      }

      if (options.loadTravelClasses) {
        flightLeg.travelClasses =
          await this.services.travelClass.getAllByFlightLegId(
            flightLeg.flightLegId
          );

        if (options.hideInactiveTravelClasses) {
          flightLeg.travelClasses = flightLeg.travelClasses.filter(
            (travelClassInfo) => travelClassInfo.isActive
          );
        }
      }

      resolve(flightLeg);
    });
  }

  async getAllByFlightId(flightId: number, options: IFlightLegAdapterOptions) {
    return this.getAllByFieldNameAndValue("flight_id", flightId, options);
  }

  async add(data: IAddFlightLeg): Promise<FlightLegModel> {
    return this.baseAdd(data, DefaultFlightLegAdapterOptions);
  }

  async edit(
    flightLegId: number,
    data: IEditFlightLeg,
    options: IFlightLegAdapterOptions
  ): Promise<FlightLegModel> {
    return this.baseEditById(flightLegId, data, options);
  }

  async addFlightLegBag(data: IFlightLegBag): Promise<number> {
    return new Promise((resolve, reject) => {
      const sql: string =
        "INSERT flight_leg_bag SET flight_leg_id = ?, bag_id = ?, price = ?;";

      this.db
        .execute(sql, [data.flight_leg_id, data.bag_id, data.price])
        .then(async (result) => {
          const info: any = result;
          resolve(+info[0]?.insertId);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  async editFlightLegBag(data: IFlightLegBag): Promise<true> {
    return new Promise((resolve, reject) => {
      const sql: string =
        "UPDATE flight_leg_bag SET price = ? WHERE flight_leg_id = ? AND bag_id = ?;";

      this.db
        .execute(sql, [data.price, data.flight_leg_id, data.bag_id])
        .then((result) => {
          const info: any = result;

          if (+info[0]?.affectedRows === 1) {
            return resolve(true);
          }

          throw {
            status: 500,
            message: "Could not edit this flight leg bag record!",
          };
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  async addFlightLegTravelClass(data: IFlightLegTravelClass): Promise<number> {
    return new Promise((resolve, reject) => {
      const sql: string =
        "INSERT flight_leg_travel_class SET flight_leg_id = ?, travel_class_id = ?, price = ?;";

      this.db
        .execute(sql, [data.flight_leg_id, data.travel_class_id, data.price])
        .then(async (result) => {
          const info: any = result;
          resolve(+info[0]?.insertId);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  async editFlightLegTravelClass(data: IFlightLegTravelClass): Promise<true> {
    return new Promise((resolve, reject) => {
      const sql: string =
        "UPDATE flight_leg_travel_class SET price = ? WHERE flight_leg_id = ? AND travel_class_id = ?;";

      this.db
        .execute(sql, [data.price, data.flight_leg_id, data.travel_class_id])
        .then((result) => {
          const info: any = result;

          if (+info[0]?.affectedRows === 1) {
            return resolve(true);
          }

          throw {
            status: 500,
            message: "Could not edit this flight leg travel class record!",
          };
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  async deleteById(flightLegId: number): Promise<true> {
    return new Promise((resolve) => {
      this.deleteAllFlightLegBagsByFlightLegId(flightLegId)
        .then(() =>
          this.deleteAllFlightLegTravelClassesByFlightLegId(flightLegId)
        )
        .then(() => this.getById(flightLegId, DefaultFlightLegAdapterOptions))
        .then((flightLeg) => {
          if (flightLeg === null)
            throw { status: 404, message: "Flight leg not found!" };
        })
        .then(async () => {
          await this.baseDeleteById(flightLegId);
        })
        .then(() => {
          resolve(true);
        })
        .catch((error) => {
          throw {
            message: error?.message ?? "Could not delete this flight leg!",
          };
        });
    });
  }

  private async deleteAllFlightLegBagsByFlightLegId(
    flightLegId: number
  ): Promise<true> {
    return new Promise((resolve) => {
      const sql = `DELETE FROM flight_leg_bag WHERE flight_leg_id = ?;`;
      this.db
        .execute(sql, [flightLegId])
        .then(() => {
          resolve(true);
        })
        .catch((error) => {
          throw {
            message: error?.message ?? "Could not delete flight leg bags!",
          };
        });
    });
  }

  private async deleteAllFlightLegTravelClassesByFlightLegId(
    flightLegId: number
  ): Promise<true> {
    return new Promise((resolve) => {
      const sql = `DELETE FROM flight_leg_travel_class WHERE flight_leg_id = ?;`;
      this.db
        .execute(sql, [flightLegId])
        .then(() => {
          resolve(true);
        })
        .catch((error) => {
          throw {
            message:
              error?.message ?? "Could not delete flight leg travel classes!",
          };
        });
    });
  }
}
