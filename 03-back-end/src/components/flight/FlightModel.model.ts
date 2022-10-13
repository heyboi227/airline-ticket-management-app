import IModel from "../../common/IModel.interface";
import FlightLegModel from "../flight_leg/FlightLegModel.model";

export default class FlightModel implements IModel {
  flightId: number;
  flightFareCode: string;

  flightLegs?: FlightLegModel[];
  bags: any;
}
