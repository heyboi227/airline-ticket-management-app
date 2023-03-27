import IModel from "../../common/IModel.interface";
import AircraftModel from "../aircraft/AircraftModel.model";
import AirportModel from "../airport/AirportModel.model";
import BagModel from "../bag/BagModel.model";
import FlightModel from "../flight/FlightModel.model";
import TravelClassModel from "../travel_class/TravelClassModel.model";

export interface IFlightLegBag {
  bag: BagModel;
  price: number;
  isActive: boolean;
}

export interface IFlightLegTravelClass {
  travelClass: TravelClassModel;
  price: number;
  isActive: boolean;
}

export default class FlightLegModel implements IModel {
  flightLegId: number;
  flightCode: string;
  originAirportId: number;
  destinationAirportId: number;
  departureDateAndTime: string;
  arrivalDateAndTime: string;
  aircraftId: number;

  bags?: IFlightLegBag[] = [];
  travelClasses?: IFlightLegTravelClass[] = [];
  originAirport?: AirportModel = null;
  destinationAirport?: AirportModel = null;
  aircraft?: AircraftModel = null;
}
