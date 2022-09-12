import * as mysql2 from "mysql2/promise";
import AdministratorService from "../components/administrator/AdministratorService.service";
import AircraftService from "../components/aircraft/AircraftService.service";
import BagService from "../components/bag/BagService.service";
import CabinService from "../components/cabin/CabinService.service";
import CountryService from "../components/country/CountryService.service";
import FlightService from "../components/flight/FlightService.service";
import AddressService from "../components/user/AddressService.service";
import UserService from "../components/user/UserService.service";

export interface IServices {
  address: AddressService;
  administrator: AdministratorService;
  aircraft: AircraftService;
  bag: BagService;
  cabin: CabinService;
  country: CountryService;
  flight: FlightService;
  user: UserService;
  /* TODO: implement DB entity services */
}

export default interface IApplicationResources {
  databaseConnection: mysql2.Connection;
  services: IServices;
}
