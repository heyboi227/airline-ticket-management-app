import BaseService from "../../common/BaseService";
import IAdapterOptions from "../../common/IAdapterOptions.interface";
import FlightLegModel from "./FlightLegModel.model";
import {
  IAddFlightLeg,
  IFlightLegBag,
  IFlightLegTravelClass,
} from "./dto/IAddFlightLeg.dto";
import { IEditFlightLeg } from "./dto/IEditFlightLeg.dto";
import { DefaultAirportAdapterOptions } from "../airport/AirportService.service";
import { DefaultFlightAdapterOptions } from "../flight/FlightService.service";

export interface IFlightLegAdapterOptions extends IAdapterOptions {
  showFlight: boolean;
  showOriginAirport: boolean;
  showDestinationAirport: boolean;
  showAircraft: boolean;
  loadBags: boolean;
  loadTravelClasses: boolean;
  hideInactiveBags: boolean;
  hideInactiveTravelClasses: boolean;
}

export const DefaultFlightLegAdapterOptions: IFlightLegAdapterOptions = {
  showFlight: true,
  showOriginAirport: true,
  showDestinationAirport: true,
  showAircraft: true,
  loadBags: true,
  loadTravelClasses: true,
  hideInactiveBags: true,
  hideInactiveTravelClasses: true,
};

export default class FlightLegService extends BaseService<
  FlightLegModel,
  IFlightLegAdapterOptions
> {
  tableName(): string {
    return "flight_leg";
  }

  protected async adaptToModel(
    data: any,
    options: IFlightLegAdapterOptions
  ): Promise<FlightLegModel> {
    const flightLeg = new FlightLegModel();

    flightLeg.flightLegId = +data?.flight_leg_id;
    flightLeg.flightCode = data?.flight_code;
    flightLeg.originAirportId = +data?.origin_airport_id;
    flightLeg.destinationAirportId = +data?.destination_airport_id;
    flightLeg.departureDateAndTime = data?.departure_date_and_time;
    flightLeg.arrivalDateAndTime = data?.arrival_date_and_time;
    flightLeg.aircraftId = +data?.aircraft_id;

    if (options.showFlight) {
      flightLeg.flight = await this.services.flight.getById(
        flightLeg.flightId,
        DefaultFlightAdapterOptions
      );
    }

    if (options.showOriginAirport) {
      flightLeg.originAirport = await this.services.airport.getById(
        flightLeg.originAirportId,
        DefaultAirportAdapterOptions
      );
    }

    if (options.showDestinationAirport) {
      flightLeg.destinationAirport = await this.services.airport.getById(
        flightLeg.destinationAirportId,
        DefaultAirportAdapterOptions
      );
    }

    if (options.showAircraft) {
      flightLeg.aircraft = await this.services.aircraft.getById(
        flightLeg.aircraftId,
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

    return flightLeg;
  }

  public async add(data: IAddFlightLeg): Promise<FlightLegModel> {
    return this.baseAdd(data, DefaultFlightLegAdapterOptions);
  }

  public async editById(
    flightLegId: number,
    data: IEditFlightLeg
  ): Promise<FlightLegModel> {
    return this.baseEditById(flightLegId, data, DefaultFlightLegAdapterOptions);
  }

  public async deleteById(flightLegId: number) {
    return this.baseDeleteById(flightLegId);
  }

  public async getByFlightCode(
    flightCode: string
  ): Promise<FlightLegModel | null> {
    return new Promise((resolve, reject) => {
      this.getAllByFieldNameAndValue(
        "flight_code",
        flightCode,
        DefaultFlightLegAdapterOptions
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

  public async getAllByFlightId(
    flightId: number,
    options: IFlightLegAdapterOptions = DefaultFlightLegAdapterOptions
  ): Promise<FlightLegModel[]> {
    return new Promise((resolve, reject) => {
      this.getAllByFieldNameAndValue(
        "flight_id",
        flightId,
        DefaultFlightLegAdapterOptions
      )
        .then((result) => {
          if (result.length === 0) {
            return resolve([]);
          }

          resolve(result);
        })
        .catch((error) => {
          reject(error?.message);
        });
    });
  }

  public async getAllByOriginAirportId(
    originAirportId: number
  ): Promise<FlightLegModel[]> {
    return new Promise((resolve, reject) => {
      this.getAllByFieldNameAndValue(
        "origin_airport_id",
        originAirportId,
        DefaultFlightLegAdapterOptions
      )
        .then((result) => {
          if (result.length === 0) {
            return resolve([]);
          }

          resolve(result);
        })
        .catch((error) => {
          reject(error?.message);
        });
    });
  }

  public async getAllByDestinationAirportId(
    destinationAirportId: number
  ): Promise<FlightLegModel[]> {
    return new Promise((resolve, reject) => {
      this.getAllByFieldNameAndValue(
        "destination_airport_id",
        destinationAirportId,
        DefaultFlightLegAdapterOptions
      )
        .then((result) => {
          if (result.length === 0) {
            return resolve([]);
          }

          resolve(result);
        })
        .catch((error) => {
          reject(error?.message);
        });
    });
  }

  public async getAllByAircraftId(
    aircraftId: number
  ): Promise<FlightLegModel[]> {
    return new Promise((resolve, reject) => {
      this.getAllByFieldNameAndValue(
        "aircraft_id",
        aircraftId,
        DefaultFlightLegAdapterOptions
      )
        .then((result) => {
          if (result.length === 0) {
            return resolve([]);
          }

          resolve(result);
        })
        .catch((error) => {
          reject(error?.message);
        });
    });
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
}
