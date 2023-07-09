import BaseService from "../../common/BaseService";
import StatusError from "../../common/StatusError";
import { FlightTravelClass } from "../flight/FlightModel.model";
import AddTravelClass from "./dto/AddTravelClass.dto";
import EditTravelClass from "./dto/EditTravelClass.dto";
import TravelClassModel from "./TravelClassModel.model";

export interface TravelClassAdapterOptions {}

export default class TravelClassService extends BaseService<
  TravelClassModel,
  TravelClassAdapterOptions
> {
  tableName(): string {
    return "travel_class";
  }

  protected async adaptToModel(
    data: any,
    _options: TravelClassAdapterOptions
  ): Promise<TravelClassModel> {
    const travelClass = new TravelClassModel();

    travelClass.travelClassId = +data?.travel_class_id;
    travelClass.travelClassName = data?.travel_class_name;
    travelClass.travelClassSubname = data?.travel_class_subname;

    return travelClass;
  }

  public async getAllByField(
    fieldName: string,
    fieldValue: number
  ): Promise<FlightTravelClass[]> {
    return new Promise((resolve, reject) => {
      this.getAllFromTableByFieldNameAndValue<{
        flight_travel_class_id: number;
        flight_id: number;
        travel_class_id: number;
        price: number;
        is_active: number;
      }>("flight_travel_class", fieldName, fieldValue)
        .then(async (result) => {
          if (result.length === 0) {
            return resolve([]);
          }

          const travelClasses: FlightTravelClass[] = await Promise.all(
            result.map(async (row) => {
              const travelClass = await this.getById(row.travel_class_id, {});

              return {
                travelClass: {
                  travelClassId: row.travel_class_id,
                  travelClassName: travelClass.travelClassName,
                  travelClassSubname: travelClass.travelClassSubname,
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

  public async getAllByFlightId(
    flightId: number
  ): Promise<FlightTravelClass[]> {
    return this.getAllByField("flight_id", flightId);
  }

  public async getAllByTravelClassId(
    travelClassId: number
  ): Promise<FlightTravelClass[]> {
    return this.getAllByField("travel_class_id", travelClassId);
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

          throw new StatusError(
            500,
            "Could not hide this flight travel class record!"
          );
        })
        .catch((error) => {
          throw new StatusError(500, error?.message);
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

          throw new StatusError(
            500,
            "Could not show this flight travel class record!"
          );
        })
        .catch((error) => {
          throw new StatusError(500, error?.message);
        });
    });
  }

  public async add(data: AddTravelClass): Promise<TravelClassModel> {
    return this.baseAdd(data, {});
  }

  public async editById(
    travelClassId: number,
    data: EditTravelClass
  ): Promise<TravelClassModel> {
    return this.baseEditById(travelClassId, data, {});
  }
}
