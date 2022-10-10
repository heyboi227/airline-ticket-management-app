import BaseService from "../../common/BaseService";
import IAdapterOptions from "../../common/IAdapterOptions.interface";
import TravelClassModel from "./TravelClassModel.model";

export interface ITravelClassAdapterOptions extends IAdapterOptions {}

interface FlightLegTravelClassInterface {
  flight_leg_travel_class_id: number;
  flight_leg_id: number;
  travel_class_id: number;
}

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

    return travelClass;
  }

  public async getAllByFlightLegId(
    flightLegId: number,
    options: ITravelClassAdapterOptions
  ): Promise<TravelClassModel[]> {
    return new Promise((resolve, reject) => {
      this.getAllFromTableByFieldNameAndValue<FlightLegTravelClassInterface>(
        "flight_leg_travel_class",
        "flight_leg_id",
        flightLegId
      )
        .then(async (result) => {
          const travelClassIds = result.map((fltc) => fltc.travel_class_id);

          const travelClasss: TravelClassModel[] = [];

          for (let travelClassId of travelClassIds) {
            const travelClass = await this.getById(travelClassId, options);
            travelClasss.push(travelClass);
          }

          resolve(travelClasss);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }
}
