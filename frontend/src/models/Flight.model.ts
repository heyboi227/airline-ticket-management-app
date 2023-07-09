import Aircraft from "./Aircraft.model";
import Airport from "./Airport.model";
import TravelClass from "./TravelClass.model";

interface FlightTravelClass {
  travelClass: TravelClass;
  price: number;
  isActive: boolean;
}

export default interface Flight {
  flightId: number;
  flightCode: string;
  originAirportId: number;
  destinationAirportId: number;
  departureDateAndTime: string;
  arrivalDateAndTime: string;
  aircraftId: number;

  travelClasses?: FlightTravelClass[];
  originAirport?: Airport;
  destinationAirport?: Airport;
  aircraft?: Aircraft;
}
