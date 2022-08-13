import BaseService from "../../common/BaseService";
import IAdapterOptions from "../../common/IAdapterOptions.interface";
import AircraftModel from "./AircraftModel.model";
import { IAddAircraft } from "./dto/IAddAircraft.dto";
import { IEditAircraft } from "./dto/IEditAircraft.dto";

export interface IAircraftAdapterOptions extends IAdapterOptions {}

export default class AircraftService extends BaseService<
  AircraftModel,
  IAircraftAdapterOptions
> {
  tableName(): string {
    return "aircraft";
  }

  protected async adaptToModel(
    data: any,
    _options: IAircraftAdapterOptions
  ): Promise<AircraftModel> {
    const aircraft = new AircraftModel();

    aircraft.aircraftId = +data?.aircraft_id;
    aircraft.type = data?.type;
    aircraft.name = data?.name;

    return aircraft;
  }

  public async add(data: IAddAircraft): Promise<AircraftModel> {
    return this.baseAdd(data, {});
  }

  public async editById(
    aircraftId: number,
    data: IEditAircraft,
    options: IAircraftAdapterOptions
  ): Promise<AircraftModel> {
    return this.baseEditById(aircraftId, data, options);
  }

  public async deleteById(aircraftId: number) {
    return this.baseDeleteById(aircraftId);
  }

  public async getAircraftByType(
    type: string,
    options: IAircraftAdapterOptions
  ): Promise<AircraftModel[]> {
    return new Promise((resolve, reject) => {
      this.getAllByFieldNameAndValue("type", type, options)
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

  public async getAircraftByName(
    name: string,
    options: IAircraftAdapterOptions
  ): Promise<AircraftModel | null> {
    return new Promise((resolve, reject) => {
      this.getAllByFieldNameAndValue("name", name, options)
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
