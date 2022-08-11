import BaseService from "../../common/BaseService";
import IAdapterOptions from "../../common/IAdapterOptions.interface";
import CountryModel from "./CountryModel.model";
import { IAddCountry } from "./dto/IAddCountry.dto";
import { IEditCountry } from "./dto/IEditCountry.dto";

export interface ICountryAdapterOptions extends IAdapterOptions {}

export default class CountryService extends BaseService<
  CountryModel,
  ICountryAdapterOptions
> {
  tableName(): string {
    return "country";
  }

  protected async adaptToModel(
    data: any,
    options: ICountryAdapterOptions
  ): Promise<CountryModel> {
    const country = new CountryModel();

    country.countryId = +data?.country_id;
    country.name = data?.name;

    return country;
  }

  public async add(data: IAddCountry): Promise<CountryModel> {
    return this.baseAdd(data, {});
  }

  public async editById(
    id: number,
    data: IEditCountry,
    options: ICountryAdapterOptions
  ): Promise<CountryModel> {
    return this.baseEditById(id, data, options);
  }

  public async deleteById(id: number) {
    return this.baseDeleteById(id);
  }

  public async getCountryByName(
    code: string,
    options: ICountryAdapterOptions
  ): Promise<CountryModel | null> {
    return new Promise((resolve, reject) => {
      this.getAllByFieldNameAndValue("name", code, options)
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
