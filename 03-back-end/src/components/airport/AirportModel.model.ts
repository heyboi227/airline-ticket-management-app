import IModel from "../../common/IModel.interface";

export default class AirportModel implements IModel {
  airportId: number;
  airportCode: string;
  name: string;
  city: string;
  countryId: number;
}
