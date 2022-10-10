import IModel from "../../common/IModel.interface";
import AircraftModel from "../aircraft/AircraftModel.model";
import AirportModel from "../airport/AirportModel.model";

export default class FlightLegModel implements IModel {
  flightLegId: number;
  flightCode: string;
  originAirportId: number;
  destinationAirportId: number;
  departureDateAndTime: string;
  arrivalDateAndTime: string;
  aircraftId: number;

  originAirport?: AirportModel;
  destinationAirport?: AirportModel;
  aircraft?: AircraftModel;
}
