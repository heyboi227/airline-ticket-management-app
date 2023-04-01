import BaseService from "../../common/BaseService";
import IAdapterOptions from "../../common/IAdapterOptions.interface";
import { DefaultAirportAdapterOptions } from "../airport/AirportService.service";
import FlightModel from "./FlightModel.model";
import {
  IAddFlight,
  IFlightBag,
  IFlightSearch,
  IFlightTravelClass,
} from "./dto/IAddFlight.dto";
import { IEditFlight } from "./dto/IEditFlight.dto";
import * as mysql2 from "mysql2/promise";

export interface IFlightAdapterOptions extends IAdapterOptions {
  loadOriginAirport: boolean;
  loadDestinationAirport: boolean;
  loadAircraft: boolean;
  loadBags: boolean;
  hideInactiveBags: boolean;
  loadTravelClasses: boolean;
  hideInactiveTravelClasses: boolean;
}

export const DefaultFlightAdapterOptions: IFlightAdapterOptions = {
  loadOriginAirport: true,
  loadDestinationAirport: true,
  loadAircraft: true,
  loadBags: true,
  hideInactiveBags: true,
  loadTravelClasses: true,
  hideInactiveTravelClasses: true,
};
export default class FlightService extends BaseService<
  FlightModel,
  IFlightAdapterOptions
> {
  tableName(): string {
    return "flight";
  }

  protected adaptToModel(
    data: any,
    options: IFlightAdapterOptions
  ): Promise<FlightModel> {
    return new Promise(async (resolve) => {
      const flight = new FlightModel();

      flight.flightId = +data?.flight_id;
      flight.flightCode = data?.flight_code;
      flight.originAirportId = +data?.origin_airport_id;
      flight.destinationAirportId = +data?.destination_airport_id;
      flight.departureDateAndTime = data?.departure_date_and_time;
      flight.arrivalDateAndTime = data?.arrival_date_and_time;
      flight.aircraftId = +data?.aircraft_id;
      flight.flightId = +data?.flight_id;

      if (options.loadOriginAirport) {
        flight.originAirport = await this.services.airport.getById(
          flight.originAirportId,
          DefaultAirportAdapterOptions
        );
      }

      if (options.loadDestinationAirport) {
        flight.destinationAirport = await this.services.airport.getById(
          flight.destinationAirportId,
          DefaultAirportAdapterOptions
        );
      }

      if (options.loadAircraft) {
        flight.aircraft = await this.services.aircraft.getById(
          flight.aircraftId,
          {}
        );
      }

      if (options.loadBags) {
        flight.bags = await this.services.bag.getAllByFlightId(flight.flightId);

        if (options.hideInactiveBags) {
          flight.bags = flight.bags.filter((bagInfo) => bagInfo.isActive);
        }
      }

      if (options.loadTravelClasses) {
        flight.travelClasses = await this.services.travelClass.getAllByFlightId(
          flight.flightId
        );

        if (options.hideInactiveTravelClasses) {
          flight.travelClasses = flight.travelClasses.filter(
            (travelClassInfo) => travelClassInfo.isActive
          );
        }
      }

      resolve(flight);
    });
  }

  public async add(data: IAddFlight): Promise<FlightModel> {
    return this.baseAdd(data, DefaultFlightAdapterOptions);
  }

  public async editById(
    flightId: number,
    data: IEditFlight
  ): Promise<FlightModel> {
    return this.baseEditById(flightId, data, DefaultFlightAdapterOptions);
  }

  public async getByFlightCode(
    flightCode: string
  ): Promise<FlightModel | null> {
    return new Promise((resolve, reject) => {
      this.getAllByFieldNameAndValue(
        "flight_code",
        flightCode,
        DefaultFlightAdapterOptions
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

  public async getAllBySearchQuery(
    data: IFlightSearch
  ): Promise<FlightModel[]> {
    return new Promise<FlightModel[]>((resolve, reject) => {
      const sql: string =
        "SELECT f1.* FROM flight f1 JOIN flight f2 ON f1.origin_airport_id = f2.destination_airport_id AND f1.destination_airport_id = f2.origin_airport_id AND f1.arrival_date_and_time < f2.departure_date_and_time WHERE f1.origin_airport_id = ? AND f1.destination_airport_id = ? AND DATE(f1.departure_date_and_time) = ? AND DATE(f2.departure_date_and_time) = ? UNION ALL SELECT f2.* FROM flight f1 JOIN flight f2 ON f1.origin_airport_id = f2.destination_airport_id AND f1.destination_airport_id = f2.origin_airport_id AND f1.arrival_date_and_time < f2.departure_date_and_time WHERE f1.origin_airport_id = ? AND f1.destination_airport_id = ? AND DATE(f1.departure_date_and_time) = ? AND DATE(f2.departure_date_and_time) = ?;";
      const values = [
        data.origin_airport_id,
        data.destination_airport_id,
        data.departure_date_and_time,
        data.return_date_and_time,
        data.origin_airport_id,
        data.destination_airport_id,
        data.departure_date_and_time,
        data.return_date_and_time,
      ];

      this.db
        .execute(sql, values)
        .then(async ([rows]) => {
          if (rows === undefined) {
            return resolve([]);
          }

          const items: FlightModel[] = [];

          for (const row of rows as mysql2.RowDataPacket[]) {
            items.push(
              await this.adaptToModel(row, DefaultFlightAdapterOptions)
            );
          }

          resolve(items);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  async addFlightBag(data: IFlightBag): Promise<number> {
    return new Promise((resolve, reject) => {
      const sql: string =
        "INSERT flight_bag SET flight_id = ?, bag_id = ?, price = ?;";

      this.db
        .execute(sql, [data.flight_id, data.bag_id, data.price])
        .then(async (result) => {
          const info: any = result;
          resolve(+info[0]?.insertId);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  async editFlightBag(data: IFlightBag): Promise<true> {
    return new Promise((resolve, reject) => {
      const sql: string =
        "UPDATE flight_bag SET price = ? WHERE flight_id = ? AND bag_id = ?;";

      this.db
        .execute(sql, [data.price, data.flight_id, data.bag_id])
        .then((result) => {
          const info: any = result;

          if (+info[0]?.affectedRows === 1) {
            return resolve(true);
          }

          throw {
            status: 500,
            message: "Could not edit this flight bag record!",
          };
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  async addFlightTravelClass(data: IFlightTravelClass): Promise<number> {
    return new Promise((resolve, reject) => {
      const sql: string =
        "INSERT flight_travel_class SET flight_id = ?, travel_class_id = ?, price = ?;";

      this.db
        .execute(sql, [data.flight_id, data.travel_class_id, data.price])
        .then(async (result) => {
          const info: any = result;
          resolve(+info[0]?.insertId);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  async editFlightTravelClass(data: IFlightTravelClass): Promise<true> {
    return new Promise((resolve, reject) => {
      const sql: string =
        "UPDATE flight_travel_class SET price = ? WHERE flight_id = ? AND travel_class_id = ?;";

      this.db
        .execute(sql, [data.price, data.flight_id, data.travel_class_id])
        .then((result) => {
          const info: any = result;

          if (+info[0]?.affectedRows === 1) {
            return resolve(true);
          }

          throw {
            status: 500,
            message: "Could not edit this flight travel class record!",
          };
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  async deleteById(flightId: number): Promise<true> {
    return new Promise((resolve) => {
      this.deleteAllFlightBagsByFlightId(flightId)
        .then(() => this.deleteAllFlightTravelClassesByFlightId(flightId))
        .then(() => this.getById(flightId, DefaultFlightAdapterOptions))
        .then((flight) => {
          if (flight === null)
            throw { status: 404, message: "Flight not found!" };
        })
        .then(async () => {
          await this.baseDeleteById(flightId);
        })
        .then(() => {
          resolve(true);
        })
        .catch((error) => {
          throw {
            message: error?.message ?? "Could not delete this flight!",
          };
        });
    });
  }

  private async deleteAllFlightBagsByFlightId(flightId: number): Promise<true> {
    return new Promise((resolve) => {
      const sql = `DELETE FROM flight_bag WHERE flight_id = ?;`;
      this.db
        .execute(sql, [flightId])
        .then(() => {
          resolve(true);
        })
        .catch((error) => {
          throw {
            message: error?.message ?? "Could not delete flight bags!",
          };
        });
    });
  }

  private async deleteAllFlightTravelClassesByFlightId(
    flightId: number
  ): Promise<true> {
    return new Promise((resolve) => {
      const sql = `DELETE FROM flight_travel_class WHERE flight_id = ?;`;
      this.db
        .execute(sql, [flightId])
        .then(() => {
          resolve(true);
        })
        .catch((error) => {
          throw {
            message:
              error?.message ?? "Could not delete flight travel classes!",
          };
        });
    });
  }
}
