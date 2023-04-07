import BaseService from "../../common/BaseService";
import IAdapterOptions from "../../common/IAdapterOptions.interface";
import { IFlightTravelClass } from "../flight/FlightModel.model";
import IAddTravelClass from "./dto/IAddTravelClass.dto";
import IEditTravelClass from "./dto/IEditTravelClass.dto";
import TravelClassModel from "./TravelClassModel.model";

export interface ITravelClassAdapterOptions extends IAdapterOptions {}

export default class TravelClassService extends BaseService<
  TravelClassModel,
  ITravelClassAdapterOptions
> {
  tableName(): string {
    return "travel_class";
  }

  protected async adaptToModel(
    data: any,
    _options: ITravelClassAdapterOptions
  ): Promise<TravelClassModel> {
    const travelClass = new TravelClassModel();

    travelClass.travelClassId = +data?.travel_class_id;
    travelClass.name = data?.name;
    travelClass.subname = data?.subname;

    return travelClass;
  }

  public async getAllByFlightId(
    flightId: number
  ): Promise<IFlightTravelClass[]> {
    return new Promise((resolve, reject) => {
      this.getAllFromTableByFieldNameAndValue<{
        flight_travel_class_id: number;
        flight_id: number;
        travel_class_id: number;
        price: number;
        is_active: number;
      }>("flight_travel_class", "flight_id", flightId)
        .then(async (result) => {
          if (result.length === 0) {
            return resolve([]);
          }

          const travelClasses: IFlightTravelClass[] = await Promise.all(
            result.map(async (row) => {
              const travelClass = await this.getById(row.travel_class_id, {});

              return {
                travelClass: {
                  travelClassId: row.travel_class_id,
                  name: travelClass.name,
                  subname: travelClass.subname,
                },
                price: row.price,
                isActive: row.is_active === 1,
              };
            })
          );

          resolve(travelClasses);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  public async getAllByTravelClassId(
    travelClassId: number
  ): Promise<IFlightTravelClass[]> {
    return new Promise((resolve, reject) => {
      this.getAllFromTableByFieldNameAndValue<{
        flight_travel_class_id: number;
        flight_id: number;
        travel_class_id: number;
        price: number;
        is_active: number;
      }>("flight_travel_class", "travel_class_id", travelClassId)
        .then(async (result) => {
          if (result.length === 0) {
            return resolve([]);
          }

          const travelClasses: IFlightTravelClass[] = await Promise.all(
            result.map(async (row) => {
              const travelClass = await this.getById(row.travel_class_id, {});

              return {
                travelClass: {
                  travelClassId: row.travel_class_id,
                  name: travelClass.name,
                  subname: travelClass.subname,
                },
                price: row.price,
                isActive: row.is_active === 1,
              };
            })
          );

          resolve(travelClasses);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  public async hideFlightTravelClass(
    flightId: number,
    travelClassId: number
  ): Promise<true> {
    return new Promise((resolve) => {
      const sql =
        "UPDATE flight_travel_class SET is_active = 0 WHERE flight_id = ? AND travel_class_id = ?;";

      this.db
        .execute(sql, [flightId, travelClassId])
        .then((result) => {
          const info: any = result;

          if (+info[0]?.affectedRows === 1) {
            return resolve(true);
          }

          throw {
            status: 500,
            message: "Could not hide this flight travel class record!",
          };
        })
        .catch((error) => {
          throw {
            status: 500,
            message: error?.message,
          };
        });
    });
  }

  public async showFlightTravelClass(
    flightId: number,
    travelClassId: number
  ): Promise<true> {
    return new Promise((resolve) => {
      const sql =
        "UPDATE flight_travel_class SET is_active = 1 WHERE flight_id = ? AND travel_class_id = ?;";

      this.db
        .execute(sql, [flightId, travelClassId])
        .then((result) => {
          const info: any = result;

          if (+info[0]?.affectedRows === 1) {
            return resolve(true);
          }

          throw {
            status: 500,
            message: "Could not show this flight travel class record!",
          };
        })
        .catch((error) => {
          throw {
            status: 500,
            message: error?.message,
          };
        });
    });
  }

  public async add(data: IAddTravelClass): Promise<TravelClassModel> {
    return this.baseAdd(data, {});
  }

  public async editById(
    travelClassId: number,
    data: IEditTravelClass
  ): Promise<TravelClassModel> {
    return this.baseEditById(travelClassId, data, {});
  }
}
