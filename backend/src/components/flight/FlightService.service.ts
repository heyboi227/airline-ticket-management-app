import BaseService from "../../common/BaseService";
import { DefaultAirportAdapterOptions } from "../airport/AirportService.service";
import FlightModel, { FlightTravelClass } from "./FlightModel.model";
import {
  AddFlight,
  FlightSearch,
  FlightTravelClass as DtoFlightTravelClass,
} from "./dto/AddFlight.dto";
import { EditFlight } from "./dto/EditFlight.dto";
import * as mysql2 from "mysql2/promise";
import AirportModel from "../airport/AirportModel.model";
import AircraftModel from "../aircraft/AircraftModel.model";
import StatusError from "../../common/StatusError";

export interface FlightAdapterOptions {
  loadOriginAirport: boolean;
  loadDestinationAirport: boolean;
  loadAircraft: boolean;
  loadTravelClasses: boolean;
  hideInactiveTravelClasses: boolean;
}

export const DefaultFlightAdapterOptions: FlightAdapterOptions = {
  loadOriginAirport: true,
  loadDestinationAirport: true,
  loadAircraft: true,
  loadTravelClasses: true,
  hideInactiveTravelClasses: true,
};
export default class FlightService extends BaseService<
  FlightModel,
  FlightAdapterOptions
> {
  tableName(): string {
    return "flight";
  }

  protected initializeFlight(data: any): FlightModel {
    const flight = new FlightModel();

    flight.flightId = +data?.flight_id;
    flight.flightCode = data?.flight_code;
    flight.originAirportId = +data?.origin_airport_id;
    flight.destinationAirportId = +data?.destination_airport_id;
    flight.departureDateAndTime = data?.departure_date_and_time_str
      ? data?.departure_date_and_time_str
      : data?.departure_date_and_time;
    flight.arrivalDateAndTime = data?.arrival_date_and_time_str
      ? data?.arrival_date_and_time_str
      : data?.arrival_date_and_time;
    flight.aircraftId = +data?.aircraft_id;

    return flight;
  }

  protected async loadResources(
    flight: FlightModel,
    options: FlightAdapterOptions
  ): Promise<
    [
      AirportModel | undefined,
      AirportModel | undefined,
      AircraftModel | undefined,
      FlightTravelClass[]
    ]
  > {
    const loadOriginAirportPromise = options.loadOriginAirport
      ? this.services.airport.getById(
          flight.originAirportId,
          DefaultAirportAdapterOptions
        )
      : Promise.resolve<AirportModel | undefined>(undefined);

    const loadDestinationAirportPromise = options.loadDestinationAirport
      ? this.services.airport.getById(
          flight.destinationAirportId,
          DefaultAirportAdapterOptions
        )
      : Promise.resolve<AirportModel | undefined>(undefined);

    const loadAircraftPromise = options.loadAircraft
      ? this.services.aircraft.getById(flight.aircraftId, {})
      : Promise.resolve<AircraftModel | undefined>(undefined);

    const loadTravelClassesPromise = options.loadTravelClasses
      ? this.services.travelClass.getAllByFlightId(flight.flightId)
      : Promise.resolve([]);

    const resources = await Promise.all([
      loadOriginAirportPromise,
      loadDestinationAirportPromise,
      loadAircraftPromise,
      loadTravelClassesPromise,
    ]);

    return resources;
  }

  protected assignResources(
    flight: FlightModel,
    resources: [
      AirportModel | undefined,
      AirportModel | undefined,
      AircraftModel | undefined,
      FlightTravelClass[]
    ],
    options: FlightAdapterOptions
  ): FlightModel {
    const [originAirport, destinationAirport, aircraft, travelClasses] =
      resources;

    if (options.loadOriginAirport) {
      flight.originAirport = originAirport!;
    }

    if (options.loadDestinationAirport) {
      flight.destinationAirport = destinationAirport!;
    }

    if (options.loadAircraft) {
      flight.aircraft = aircraft!;
    }

    if (options.loadTravelClasses) {
      flight.travelClasses = travelClasses;

      if (options.hideInactiveTravelClasses) {
        flight.travelClasses = flight.travelClasses.filter(
          (travelClassInfo) => travelClassInfo.isActive
        );
      }
    }

    return flight;
  }

  protected async adaptToModel(
    data: any,
    options: FlightAdapterOptions
  ): Promise<FlightModel> {
    const flight = this.initializeFlight(data);

    const resources = await this.loadResources(flight, options);
    const updatedFlight = this.assignResources(flight, resources, options);
    return updatedFlight;
  }

  public async add(data: AddFlight): Promise<FlightModel> {
    return this.baseAdd(data, DefaultFlightAdapterOptions);
  }

  public async editById(
    flightId: number,
    data: EditFlight
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

  public async getAllByDateSearchQuery(
    data: FlightSearch
  ): Promise<FlightModel[]> {
    return new Promise<FlightModel[]>((resolve, reject) => {
      const sql: string =
        "SELECT * from `flight` where `origin_airport_id` = ? AND `destination_airport_id` = ? AND DATE(`departure_date_and_time`) = ?;";
      const values = [
        data.origin_airport_id,
        data.destination_airport_id,
        data.departure_date,
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

  async addFlightTravelClass(data: DtoFlightTravelClass): Promise<number> {
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

  async editFlightTravelClass(data: DtoFlightTravelClass): Promise<true> {
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

          throw new StatusError(
            500,
            "Could not edit this flight travel class record!"
          );
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  async deleteById(flightId: number): Promise<true> {
    return new Promise((resolve) => {
      this.deleteAllFlightTravelClassesByFlightId(flightId)
        .then(() => this.getById(flightId, DefaultFlightAdapterOptions))
        .then((flight) => {
          if (flight === null) throw new StatusError(404, "Flight not found!");
        })
        .then(async () => {
          await this.baseDeleteById(flightId);
        })
        .then(() => {
          resolve(true);
        })
        .catch((error) => {
          throw new Error(error?.message ?? "Could not delete this flight!");
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
          throw new Error(
            error?.message ?? "Could not delete flight travel classes!"
          );
        });
    });
  }

  public async deleteAllFlightsByAirportId(airportId: number): Promise<true> {
    return new Promise((resolve) => {
      const sql1 =
        "DELETE FROM `flight_travel_class` WHERE `flight_id` IN (SELECT `flight_id` FROM `flight` WHERE CONCAT_WS('|', `origin_airport_id`, `destination_airport_id`) LIKE CONCAT('%', ?, '%'));";
      const sql2 =
        "DELETE FROM `flight` WHERE CONCAT_WS('|', `origin_airport_id`, `destination_airport_id`) LIKE CONCAT('%', ?, '%');";
      this.db
        .execute(sql1, [airportId])
        .then(() => resolve(true))
        .catch((error) => {
          throw new Error(
            error?.message ?? "Could not delete the flight travel class prices!"
          );
        });
      this.db
        .execute(sql2, [airportId])
        .then(() => resolve(true))
        .catch((error) => {
          throw new Error(error?.message ?? "Could not delete the flights!");
        });
    });
  }
}
