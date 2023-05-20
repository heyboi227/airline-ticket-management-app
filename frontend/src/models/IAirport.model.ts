import ICountry from "./ICountry.model";

export default interface IAirport {
  airportId: number;
  airportCode: string;
  airportName: string;
  city: string;
  countryId: number;
  timeZone: string;

  country?: ICountry;
}
