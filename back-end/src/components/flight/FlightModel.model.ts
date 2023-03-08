import IModel from "../../common/IModel.interface";

export default class FlightModel implements IModel {
  flightId: number;
  flightFareCode: string;
}
