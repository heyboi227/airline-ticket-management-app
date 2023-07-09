import BaseService from "../../common/BaseService";
import CountryModel from "./CountryModel.model";
import { AddCountry } from "./dto/AddCountry.dto";
import { EditCountry } from "./dto/EditCountry.dto";

export interface CountryAdapterOptions {}

export default class CountryService extends BaseService<
  CountryModel,
  CountryAdapterOptions
> {
  tableName(): string {
    return "country";
  }

  protected async adaptToModel(
    data: any,
    _options: CountryAdapterOptions
  ): Promise<CountryModel> {
    const country = new CountryModel();

    country.countryId = +data?.country_id;
    country.countryName = data?.country_name;

    return country;
  }

  public async add(data: AddCountry): Promise<CountryModel> {
    return this.baseAdd(data, {});
  }

  public async editById(
    countryId: number,
    data: EditCountry
  ): Promise<CountryModel> {
    return this.baseEditById(countryId, data, {});
  }

  public async deleteById(countryId: number) {
    return this.baseDeleteById(countryId);
  }

  public async getByName(name: string): Promise<CountryModel | null> {
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
