import BaseService from "../../common/BaseService";
import IAdapterOptions from "../../common/IAdapterOptions.interface";
import FlightModel from "./FlightModel.model";
import { IAddFlight, IFlightFlightLeg } from "./dto/IAddFlight.dto";
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
    options: IFlightAdapterOptions
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

  public async getByFlightFareCode(
    flightFareCode: string
  ): Promise<FlightModel | null> {
    return new Promise((resolve, reject) => {
      this.getAllByFieldNameAndValue("flight_fare_code", flightFareCode, {})
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

  async addFlightFlightLeg(data: IFlightFlightLeg): Promise<number> {
    return new Promise((resolve, reject) => {
      const sql: string =
        "INSERT flight_flight_leg SET flight_id = ?, flight_leg_id = ?;";

      this.db
        .execute(sql, [data.flight_id, data.flight_leg_id])
        .then(async (result) => {
          const info: any = result;
          resolve(+info[0]?.insertId);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  async deleteFlightFlightLeg(data: IFlightFlightLeg): Promise<number> {
    return new Promise((resolve, reject) => {
      const sql: string =
        "DELETE FROM flight_flight_leg WHERE flight_id = ? AND flight_flight_leg = ?;";

      this.db
        .execute(sql, [data.flight_id, data.flight_leg_id])
        .then(async (result) => {
          const info: any = result;
          resolve(+info[0]?.affectedRows);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  private async deleteAllFlightLegsByFlightId(flightId: number): Promise<true> {
    return new Promise((resolve) => {
      const sql = `DELETE FROM flight_flight_leg WHERE flight_id = ?`;
      this.db
        .execute(sql, [flightId])
        .then(() => {
          resolve(true);
        })
        .catch((error) => {
          throw {
            message: error?.message ?? "Could not delete flight legs!",
          };
        });
    });
  }
}
