import BaseService from "../../common/BaseService";
import IAdapterOptions from "../../common/IAdapterOptions.interface";
import AirportModel from "./AirportModel.model";
import { IAddAirport } from "./dto/IAddAirport.dto";
import { IEditAirport } from "./dto/IEditAirport.dto";

export interface IAirportAdapterOptions extends IAdapterOptions {}

export default class AirportService extends BaseService<
  AirportModel,
  IAirportAdapterOptions
> {
  tableName(): string {
    return "aircraft";
  }

  protected async adaptToModel(
    data: any,
    _options: IAirportAdapterOptions
  ): Promise<AirportModel> {
    const airport = new AirportModel();

    airport.airportId = +data?.airport_id;
    airport.airportCode = data?.airport_code;
    airport.name = data?.name;
    airport.city = data?.city;
    airport.countryId = +data?.country_id;

    return airport;
  }

  public async add(data: IAddAirport): Promise<AirportModel> {
    return this.baseAdd(data, {});
  }

  public async editById(
    airportId: number,
    data: IEditAirport
  ): Promise<AirportModel> {
    return this.baseEditById(airportId, data, {});
  }

  public async deleteById(airportId: number) {
    return this.baseDeleteById(airportId);
  }

  public async getByAirportCode(
    airportCode: string
  ): Promise<AirportModel | null> {
    return new Promise((resolve, reject) => {
      this.getAllByFieldNameAndValue("airport_code", airportCode, {})
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
      this.getAllByFieldNameAndValue("name", name, {})
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
      this.getAllByFieldNameAndValue("city", city, {})
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

  public async getAllByCountryId(countryId: string): Promise<AirportModel[]> {
    return new Promise((resolve, reject) => {
      this.getAllByFieldNameAndValue("country_idd", countryId, {})
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
