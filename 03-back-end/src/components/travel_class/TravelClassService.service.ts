import BaseService from "../../common/BaseService";
import IAdapterOptions from "../../common/IAdapterOptions.interface";
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

    return travelClass;
  }
}
