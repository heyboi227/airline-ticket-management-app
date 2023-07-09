import Model from "../../common/Model.interface";
import CountryModel from "../country/CountryModel.model";
import TimeZoneModel from "../time_zone/TimeZoneModel.model";

export default class AirportModel implements Model {
  airportId: number;
  airportCode: string;
  airportName: string;
  city: string;
  countryId: number;
  timeZoneId: number;

  country?: CountryModel;
  timeZone?: TimeZoneModel;
}
