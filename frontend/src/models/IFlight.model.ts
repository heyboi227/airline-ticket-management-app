import IAircraft from "./IAircraft.model";
import IAirport from "./IAirport.model";
import IBag from "./IBag.model";
import ITravelClass from "./ITravelClass.model";

interface IFlightBag {
  bag: IBag;
  price: number;
  isActive: boolean;
}

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

  bags?: IFlightBag[];
  travelClasses?: IFlightTravelClass[];
  originAirport?: IAirport;
  destinationAirport?: IAirport;
  aircraft?: IAircraft;
}
