import IModel from "../../common/IModel.interface";
import CountryModel from "../country/CountryModel.model";

export default class AirportModel implements IModel {
  airportId: number;
  airportCode: string;
  name: string;
  city: string;
  countryId: number;

  country?: CountryModel;
}
