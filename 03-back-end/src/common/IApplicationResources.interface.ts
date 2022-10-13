import * as mysql2 from "mysql2/promise";
import AdministratorService from "../components/administrator/AdministratorService.service";
import AircraftService from "../components/aircraft/AircraftService.service";
import AirportService from "../components/airport/AirportService.service";
import BagService from "../components/bag/BagService.service";
import TravelClassService from "../components/travel_class/TravelClassService.service";
import CountryService from "../components/country/CountryService.service";
import DocumentService from "../components/document/DocumentService.service";
import FlightService from "../components/flight/FlightService.service";
import AddressService from "../components/user/AddressService.service";
import UserService from "../components/user/UserService.service";
import TicketService from "../components/ticket/TicketService.service";
import FlightLegService from "../components/flight_leg/FlightLegService.service";
import PhotoService from "../components/photo/PhotoService.service";

export interface IServices {
  address: AddressService;
  administrator: AdministratorService;
  aircraft: AircraftService;
  airport: AirportService;
  bag: BagService;
  country: CountryService;
  document: DocumentService;
  flight: FlightService;
  flightLeg: FlightLegService;
  photo: PhotoService;
  ticket: TicketService;
  travelClass: TravelClassService;
  user: UserService;
}

export default interface IApplicationResources {
  databaseConnection: mysql2.Connection;
  services: IServices;
}
