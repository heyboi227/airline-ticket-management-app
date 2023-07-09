import Model from "../../common/Model.interface";
import AircraftModel from "../aircraft/AircraftModel.model";
import AirportModel from "../airport/AirportModel.model";
import TravelClassModel from "../travel_class/TravelClassModel.model";

export interface FlightTravelClass {
  travelClass: TravelClassModel;
  price: number;
  isActive: boolean;
}

export default class FlightModel implements Model {
  flightId: number;
  flightCode: string;
  originAirportId: number;
  destinationAirportId: number;
  departureDateAndTime: string;
  arrivalDateAndTime: string;
  aircraftId: number;

  travelClasses?: FlightTravelClass[] = [];
  originAirport?: AirportModel = null;
  destinationAirport?: AirportModel = null;
  aircraft?: AircraftModel = null;
}
