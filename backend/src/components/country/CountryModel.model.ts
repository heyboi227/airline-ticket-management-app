import IModel from "../../common/IModel.interface";

export default class CountryModel implements IModel {
  countryId: number;
  countryName: string;
}
