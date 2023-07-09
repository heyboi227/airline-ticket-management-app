import BaseService from "../../common/BaseService";
import TimeZoneModel from "./TimeZoneModel.model";
import { AddTimeZone } from "./dto/AddTimeZone.dto";
import { EditTimeZone } from "./dto/EditTimeZone.dto";

export interface TimeZoneAdapterOptions {}

export default class TimeZoneService extends BaseService<
  TimeZoneModel,
  TimeZoneAdapterOptions
> {
  tableName(): string {
    return "time_zone";
  }

  protected async adaptToModel(
    data: any,
    _options: TimeZoneAdapterOptions
  ): Promise<TimeZoneModel> {
    const timeZone = new TimeZoneModel();

    timeZone.timeZoneId = +data?.time_zone_id;
    timeZone.timeZoneName = data?.time_zone_name;

    return timeZone;
  }

  public async add(data: AddTimeZone): Promise<TimeZoneModel> {
    return this.baseAdd(data, {});
  }

  public async editById(
    timeZoneId: number,
    data: EditTimeZone
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
