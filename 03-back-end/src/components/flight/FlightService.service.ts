import BaseService from "../../common/BaseService";
import IAdapterOptions from "../../common/IAdapterOptions.interface";
import FlightModel from "./FlightModel.model";
import { IAddFlight } from "./dto/IAddFlight.dto";
import { IEditFlight } from "./dto/IEditFlight.dto";

export interface IFlightAdapterOptions extends IAdapterOptions {}

export default class FlightService extends BaseService<
  FlightModel,
  IFlightAdapterOptions
> {
  tableName(): string {
    return "flight";
  }

  protected async adaptToModel(
    data: any,
    _options: IFlightAdapterOptions
  ): Promise<FlightModel> {
    const flight = new FlightModel();

    flight.flightId = +data?.flight_id;
    flight.flightFareCode = data?.flight_fare_code;

    return flight;
  }

  public async add(data: IAddFlight): Promise<FlightModel> {
    return this.baseAdd(data, {});
  }

  public async editById(
    flightId: number,
    data: IEditFlight
  ): Promise<FlightModel> {
    return this.baseEditById(flightId, data, {});
  }

  public async deleteById(flightId: number) {
    return this.baseDeleteById(flightId);
  }

  public async getByFlightFareCode(
    flightFareCode: string
  ): Promise<FlightModel | null> {
    return new Promise((resolve, reject) => {
      this.getAllByFieldNameAndValue("flightFareCode", flightFareCode, {})
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
}
