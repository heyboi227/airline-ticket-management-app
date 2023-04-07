import IAircraft from "./IAircraft.model";
import IAirport from "./IAirport.model";
import ITravelClass from "./ITravelClass.model";

interface IFlightTravelClass {
  travelClass: ITravelClass;
  price: number;
  isActive: boolean;
}

export default interface IFlight {
  flightId: number;
  flightCode: string;
  originAirportId: number;
  destinationAirportId: number;
  departureDateAndTime: string;
  arrivalDateAndTime: string;
  aircraftId: number;

  travelClasses?: IFlightTravelClass[];
  originAirport?: IAirport;
  destinationAirport?: IAirport;
  aircraft?: IAircraft;
}
