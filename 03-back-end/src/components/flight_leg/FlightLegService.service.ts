import BaseService from "../../common/BaseService";
import IAdapterOptions from "../../common/IAdapterOptions.interface";
import FlightLegModel from "./FlightLegModel.model";
import { IAddFlightLeg } from "./dto/IAddFlightLeg.dto";
import { IEditFlightLeg } from "./dto/IEditFlightLeg.dto";
import { DefaultAirportAdapterOptions } from "../airport/AirportService.service";

export interface IFlightLegAdapterOptions extends IAdapterOptions {
  showOriginAirport: boolean;
  showDestinationAirport: boolean;
  showAircraft: boolean;
}

export const DefaultFlightLegAdapterOptions: IFlightLegAdapterOptions = {
  showOriginAirport: true,
  showDestinationAirport: true,
  showAircraft: true,
};

interface FlightFlightLegInterface {
  flight_flight_leg_id: number;
  flight_id: number;
  flight_leg_id: number;
}

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
      this.getAllFromTableByFieldNameAndValue<FlightFlightLegInterface>(
        "flight_flight_leg",
        "flight_id",
        flightId
      )
        .then(async (result) => {
          const flightLegIds = result.map((ffl) => ffl.flight_leg_id);

          const flightLegs: FlightLegModel[] = [];

          for (let flightLegId of flightLegIds) {
            const flightLeg = await this.getById(flightLegId, options);
            flightLegs.push(flightLeg);
          }

          resolve(flightLegs);
        })
        .catch((error) => {
          reject(error);
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
}
