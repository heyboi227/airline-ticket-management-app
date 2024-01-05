import BaseService from "../../common/BaseService";
import AircraftModel from "./AircraftModel.model";
import { AddAircraft } from "./dto/AddAircraft.dto";
import { EditAircraft } from "./dto/EditAircraft.dto";

export interface AircraftAdapterOptions {}

export default class AircraftService extends BaseService<
  AircraftModel,
  AircraftAdapterOptions
> {
  tableName(): string {
    return "aircraft";
  }

  protected async adaptToModel(
    data: any,
    _options: AircraftAdapterOptions
  ): Promise<AircraftModel> {
    const aircraft = new AircraftModel();

    aircraft.aircraftId = +data?.aircraft_id;
    aircraft.aircraftType = data?.aircraft_type;
    aircraft.aircraftName = data?.aircraft_name;

    return aircraft;
  }

  public async add(data: AddAircraft): Promise<AircraftModel> {
    return this.baseAdd(data, {});
  }

  public async editById(
    aircraftId: number,
    data: EditAircraft
  ): Promise<AircraftModel> {
    return this.baseEditById(aircraftId, data, {});
  }

  public async deleteById(aircraftId: number) {
    return this.baseDeleteById(aircraftId);
  }

  public async getAllByAircraftType(aircraftType: string): Promise<AircraftModel[]> {
    return new Promise((resolve, reject) => {
      this.getAllByFieldNameAndValue("aircraft_type", aircraftType, {})
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

  public async getByAircraftName(aircraftName: string): Promise<AircraftModel | null> {
    return new Promise((resolve, reject) => {
      this.getAllByFieldNameAndValue("aircraft_name", aircraftName, {})
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
