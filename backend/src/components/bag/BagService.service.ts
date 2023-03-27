import BaseService from "../../common/BaseService";
import IAdapterOptions from "../../common/IAdapterOptions.interface";
import { IFlightLegBag } from "../flight_leg/FlightLegModel.model";
import BagModel from "./BagModel.model";
import IAddBag from "./dto/IAddBag.dto";
import IEditBag from "./dto/IEditBag.dto";

export interface IBagAdapterOptions extends IAdapterOptions {}

export default class BagService extends BaseService<
  BagModel,
  IBagAdapterOptions
> {
  tableName(): string {
    return "bag";
  }

  protected async adaptToModel(
    data: any,
    _options: IBagAdapterOptions
  ): Promise<BagModel> {
    const bag = new BagModel();

    bag.bagId = +data?.bag_id;
    bag.name = data?.name;

    return bag;
  }

  public async getAllByFlightLegId(
    flightLegId: number
  ): Promise<IFlightLegBag[]> {
    return new Promise((resolve, reject) => {
      this.getAllFromTableByFieldNameAndValue<{
        flight_leg_bag_id: number;
        flight_leg_id: number;
        bag_id: number;
        price: number;
        is_active: number;
      }>("flight_leg_bag", "flight_leg_id", flightLegId)
        .then(async (result) => {
          if (result.length === 0) {
            return resolve([]);
          }

          const bags: IFlightLegBag[] = await Promise.all(
            result.map(async (row) => {
              const bag = await this.getById(row.bag_id, {});

              return {
                bag: {
                  bagId: row.bag_id,
                  name: bag.name,
                },
                price: row.price,
                isActive: row.is_active === 1,
              };
            })
          );

          resolve(bags);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  public async getAllByBagId(bagId: number): Promise<IFlightLegBag[]> {
    return new Promise((resolve, reject) => {
      this.getAllFromTableByFieldNameAndValue<{
        flight_leg_bag_id: number;
        flight_leg_id: number;
        bag_id: number;
        price: number;
        is_active: number;
      }>("flight_leg_bag", "bag_id", bagId)
        .then(async (result) => {
          if (result.length === 0) {
            return resolve([]);
          }

          const bags: IFlightLegBag[] = await Promise.all(
            result.map(async (row) => {
              const bag = await this.getById(row.bag_id, {});

              return {
                bag: {
                  bagId: row.bag_id,
                  name: bag.name,
                },
                price: row.price,
                isActive: row.is_active === 1,
              };
            })
          );

          resolve(bags);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  public async hideFlightLegBag(
    flightLegId: number,
    bagId: number
  ): Promise<true> {
    return new Promise((resolve) => {
      const sql =
        "UPDATE flight_leg_bag SET is_active = 0 WHERE flight_leg_id = ? AND bag_id = ?;";

      this.db
        .execute(sql, [flightLegId, bagId])
        .then((result) => {
          const info: any = result;

          if (+info[0]?.affectedRows === 1) {
            return resolve(true);
          }

          throw {
            status: 500,
            message: "Could not hide this flight leg bag record!",
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

  public async showFlightLegBag(
    flightLegId: number,
    bagId: number
  ): Promise<true> {
    return new Promise((resolve) => {
      const sql =
        "UPDATE flight_leg_bag SET is_active = 1 WHERE flight_leg_id = ? AND bag_id = ?;";

      this.db
        .execute(sql, [flightLegId, bagId])
        .then((result) => {
          const info: any = result;

          if (+info[0]?.affectedRows === 1) {
            return resolve(true);
          }

          throw {
            status: 500,
            message: "Could not show this flight leg bag record!",
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

  public async add(data: IAddBag): Promise<BagModel> {
    return this.baseAdd(data, {});
  }

  public async editById(bagId: number, data: IEditBag): Promise<BagModel> {
    return this.baseEditById(bagId, data, {});
  }
}
