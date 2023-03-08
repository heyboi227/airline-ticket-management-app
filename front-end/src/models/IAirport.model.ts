import ICountry from "./ICountry.model";

export default interface IAirport {
  airportId: number;
  airportCode: string;
  name: string;
  city: string;
  countryId: number;

  country?: ICountry;
}
