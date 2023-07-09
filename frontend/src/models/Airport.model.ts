import Country from "./Country.model";
import TimeZone from "./TimeZone.model";

export default interface Airport {
  airportId: number;
  airportCode: string;
  airportName: string;
  city: string;
  countryId: number;
  timeZoneId: number;

  country?: Country;
  timeZone?: TimeZone;
}
