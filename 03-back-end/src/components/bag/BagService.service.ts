import BaseService from "../../common/BaseService";
import IAdapterOptions from "../../common/IAdapterOptions.interface";
import BagModel from "./BagModel.model";

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
    bag.type = data?.type;

    return bag;
  }
}
