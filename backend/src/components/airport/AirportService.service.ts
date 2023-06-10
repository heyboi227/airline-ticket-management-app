import BaseService from "../../common/BaseService";
import IAdapterOptions from "../../common/IAdapterOptions.interface";
import StatusError from "../../common/StatusError";
import AirportModel from "./AirportModel.model";
import { IAddAirport } from "./dto/IAddAirport.dto";
import { IEditAirport } from "./dto/IEditAirport.dto";
import * as mysql2 from "mysql2/promise";

export interface IAirportAdapterOptions extends IAdapterOptions {
  showCountry: boolean;
  showTimeZone: boolean;
}

export const DefaultAirportAdapterOptions: IAirportAdapterOptions = {
  showCountry: true,
  showTimeZone: true,
};

export default class AirportService extends BaseService<
  AirportModel,
  IAirportAdapterOptions
> {
  tableName(): string {
    return "airport";
  }

  protected async adaptToModel(
    data: any,
    options: IAirportAdapterOptions
  ): Promise<AirportModel> {
    const airport = new AirportModel();

    airport.airportId = +data?.airport_id;
    airport.airportCode = data?.airport_code;
    airport.airportName = data?.airport_name;
    airport.city = data?.city;
    airport.countryId = +data?.country_id;
    airport.timeZoneId = +data?.time_zone_id;

    if (options.showCountry) {
      airport.country = await this.services.country.getById(
        airport.countryId,
        {}
      );
    }

    if (options.showTimeZone) {
      airport.timeZone = await this.services.timeZone.getById(
        airport.timeZoneId,
        {}
      );
    }

    return airport;
  }

  public async add(data: IAddAirport): Promise<AirportModel> {
    return this.baseAdd(data, DefaultAirportAdapterOptions);
  }

  public async editById(
    airportId: number,
    data: IEditAirport
  ): Promise<AirportModel> {
    return this.baseEditById(airportId, data, DefaultAirportAdapterOptions);
  }

  public async deleteById(airportId: number): Promise<true> {
    return new Promise((resolve) => {
      this.services.flight
        .deleteAllFlightsByAirportId(airportId)
        .then(() => this.getById(airportId, DefaultAirportAdapterOptions))
        .then((airport) => {
          if (airport === null)
            throw new StatusError(404, "Airport not found!");
        })
        .then(async () => {
          await this.baseDeleteById(airportId);
        })
        .then(() => resolve(true))
        .catch((error) => {
          throw new Error(error?.message ?? "Could not delete this airport!");
        });
    });
  }

  public async getByAirportCode(
    airportCode: string
  ): Promise<AirportModel | null> {
    return new Promise((resolve, reject) => {
      this.getAllByFieldNameAndValue(
        "airport_code",
        airportCode,
        DefaultAirportAdapterOptions
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

  public async getByName(name: string): Promise<AirportModel | null> {
    return new Promise((resolve, reject) => {
      this.getAllByFieldNameAndValue("name", name, DefaultAirportAdapterOptions)
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

  public async getAllByCity(city: string): Promise<AirportModel[]> {
    return new Promise((resolve, reject) => {
      this.getAllByFieldNameAndValue("city", city, DefaultAirportAdapterOptions)
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

  public async getAllByCountryId(countryId: number): Promise<AirportModel[]> {
    return new Promise((resolve, reject) => {
      this.getAllByFieldNameAndValue(
        "country_id",
        countryId,
        DefaultAirportAdapterOptions
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

  public async getAllBySearchString(
    searchString: string
  ): Promise<AirportModel[]> {
    return new Promise<AirportModel[]>((resolve, reject) => {
      const sql: string =
        "SELECT * FROM `airport` WHERE CONCAT_WS('|', `airport_name`, `airport_code`, `city`) LIKE CONCAT('%', ?, '%');";

      this.db
        .execute(sql, [searchString])
        .then(async ([rows]) => {
          if (rows === undefined) {
            return resolve([]);
          }

          const items: AirportModel[] = [];

          for (const row of rows as mysql2.RowDataPacket[]) {
            items.push(
              await this.adaptToModel(row, DefaultAirportAdapterOptions)
            );
          }

          resolve(items);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }
}
