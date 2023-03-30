import IModel from "../../common/IModel.interface";
import AircraftModel from "../aircraft/AircraftModel.model";
import AirportModel from "../airport/AirportModel.model";
import BagModel from "../bag/BagModel.model";
import TravelClassModel from "../travel_class/TravelClassModel.model";

export interface IFlightBag {
  bag: BagModel;
  price: number;
  isActive: boolean;
}

export interface IFlightTravelClass {
  travelClass: TravelClassModel;
  price: number;
  isActive: boolean;
}

export default class FlightModel implements IModel {
  flightId: number;
  flightCode: string;
  originAirportId: number;
  destinationAirportId: number;
  departureDateAndTime: string;
  arrivalDateAndTime: string;
  aircraftId: number;

  bags?: IFlightBag[] = [];
  travelClasses?: IFlightTravelClass[] = [];
  originAirport?: AirportModel = null;
  destinationAirport?: AirportModel = null;
  aircraft?: AircraftModel = null;
}
