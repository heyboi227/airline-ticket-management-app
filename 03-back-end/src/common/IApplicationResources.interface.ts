import * as mysql2 from "mysql2/promise";
import AdministratorService from "../components/administrator/AdministratorService.service";
import AircraftService from "../components/aircraft/AircraftService.service";
import AirportService from "../components/airport/AirportService.service";
import BagService from "../components/bag/BagService.service";
import TravelClassService from "../components/class/TravelClassService.service";
import CountryService from "../components/country/CountryService.service";
import FlightService from "../components/flight/FlightService.service";
import AddressService from "../components/user/AddressService.service";
import UserService from "../components/user/UserService.service";

export interface IServices {
  address: AddressService;
  administrator: AdministratorService;
  aircraft: AircraftService;
  airport: AirportService;
  bag: BagService;
  country: CountryService;
  flight: FlightService;
  travelClass: TravelClassService;
  user: UserService;
  /* TODO: implement DB entity services */
}

export default interface IApplicationResources {
  databaseConnection: mysql2.Connection;
  services: IServices;
}
