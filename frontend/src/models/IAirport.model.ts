import ICountry from "./ICountry.model";
import ITimeZone from "./ITimeZone.model";

export default interface IAirport {
  airportId: number;
  airportCode: string;
  airportName: string;
  city: string;
  countryId: number;
  timeZoneId: number;

  country?: ICountry;
  timeZone?: ITimeZone;
}
