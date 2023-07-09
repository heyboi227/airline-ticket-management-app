import * as mysql2 from "mysql2/promise";
import AdministratorService from "../components/administrator/AdministratorService.service";
import AircraftService from "../components/aircraft/AircraftService.service";
import AirportService from "../components/airport/AirportService.service";
import TravelClassService from "../components/travel_class/TravelClassService.service";
import CountryService from "../components/country/CountryService.service";
import DocumentService from "../components/document/DocumentService.service";
import FlightService from "../components/flight/FlightService.service";
import AddressService from "../components/user/AddressService.service";
import UserService from "../components/user/UserService.service";
import TicketService from "../components/ticket/TicketService.service";
import TimeZoneService from "../components/time_zone/TimeZoneService.service";

export interface Services {
  address: AddressService;
  administrator: AdministratorService;
  aircraft: AircraftService;
  airport: AirportService;
  country: CountryService;
  document: DocumentService;
  flight: FlightService;
  ticket: TicketService;
  timeZone: TimeZoneService;
  travelClass: TravelClassService;
  user: UserService;
}

export default interface ApplicationResources {
  databaseConnection: mysql2.Connection;
  services: Services;
}
