import IModel from "../../common/IModel.interface";
import FlightLegModel from "../flight_leg/FlightLegModel.model";

export interface IFlightFlightLeg {
  flightLeg: FlightLegModel;
  isActive: boolean;
}

export default class FlightModel implements IModel {
  flightId: number;
  flightFareCode: string;

  flightLegs?: IFlightFlightLeg[] = [];
}
