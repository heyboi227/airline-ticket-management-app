import BaseService from "../../common/BaseService";
import IAdapterOptions from "../../common/IAdapterOptions.interface";
import CabinModel from "./CabinModel.model";

export interface ICabinAdapterOptions extends IAdapterOptions {}

export default class CabinService extends BaseService<
  CabinModel,
  ICabinAdapterOptions
> {
  tableName(): string {
    return "cabin";
  }

  protected async adaptToModel(
    data: any,
    _options: ICabinAdapterOptions
  ): Promise<CabinModel> {
    const cabin = new CabinModel();

    cabin.cabinId = +data?.cabin_id;
    cabin.name = data?.name;

    return cabin;
  }
}
