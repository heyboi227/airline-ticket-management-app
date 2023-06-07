import BaseService from "../../common/BaseService";
import IAdapterOptions from "../../common/IAdapterOptions.interface";
import TimeZoneModel from "./TimeZoneModel.model";
import { IAddTimeZone } from "./dto/IAddTimeZone.dto";
import { IEditTimeZone } from "./dto/IEditTimeZone.dto";

export interface ITimeZoneAdapterOptions extends IAdapterOptions {}

export default class TimeZoneService extends BaseService<
  TimeZoneModel,
  ITimeZoneAdapterOptions
> {
  tableName(): string {
    return "time_zone";
  }

  protected async adaptToModel(
    data: any,
    _options: ITimeZoneAdapterOptions
  ): Promise<TimeZoneModel> {
    const timeZone = new TimeZoneModel();

    timeZone.timeZoneId = +data?.time_zone_id;
    timeZone.timeZoneName = data?.time_zone_name;

    return timeZone;
  }

  public async add(data: IAddTimeZone): Promise<TimeZoneModel> {
    return this.baseAdd(data, {});
  }

  public async editById(
    timeZoneId: number,
    data: IEditTimeZone
  ): Promise<TimeZoneModel> {
    return this.baseEditById(timeZoneId, data, {});
  }

  public async deleteById(timeZoneId: number) {
    return this.baseDeleteById(timeZoneId);
  }

  public async getByTimeZoneName(
    timeZoneName: string
  ): Promise<TimeZoneModel | null> {
    return new Promise((resolve, reject) => {
      this.getAllByFieldNameAndValue("time_zone_name", timeZoneName, {})
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
