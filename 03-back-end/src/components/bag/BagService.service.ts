import BaseService from "../../common/BaseService";
import IAdapterOptions from "../../common/IAdapterOptions.interface";
import BagModel from "./BagModel.model";

export interface IBagAdapterOptions extends IAdapterOptions {}

interface FlightLegBagInterface {
  flight_leg_bag_id: number;
  flight_leg_id: number;
  bag_id: number;
}

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
    bag.name = data?.name;

    return bag;
  }

  public async getAllByFlightLegId(
    flightLegId: number,
    options: IBagAdapterOptions
  ): Promise<BagModel[]> {
    return new Promise((resolve, reject) => {
      this.getAllFromTableByFieldNameAndValue<FlightLegBagInterface>(
        "flight_leg_bag",
        "flight_leg_id",
        flightLegId
      )
        .then(async (result) => {
          const bagIds = result.map((flb) => flb.bag_id);

          const bags: BagModel[] = [];

          for (let bagId of bagIds) {
            const bag = await this.getById(bagId, options);
            bags.push(bag);
          }

          resolve(bags);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }
}
