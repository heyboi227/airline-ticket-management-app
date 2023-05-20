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
    aircraft.aircraftType = data?.type;
    aircraft.aircraftName = data?.name;

    return aircraft;
  }

  public async add(data: IAddAircraft): Promise<AircraftModel> {
    return this.baseAdd(data, {});
  }

  public async editById(
    aircraftId: number,
    data: IEditAircraft
  ): Promise<AircraftModel> {
    return this.baseEditById(aircraftId, data, {});
  }

  public async deleteById(aircraftId: number) {
    return this.baseDeleteById(aircraftId);
  }

  public async getAllByType(type: string): Promise<AircraftModel[]> {
    return new Promise((resolve, reject) => {
      this.getAllByFieldNameAndValue("type", type, {})
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

  public async getByName(name: string): Promise<AircraftModel | null> {
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
}
