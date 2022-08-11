import * as mysql2 from "mysql2/promise";
import AdministratorService from "../components/administrator/AdministratorService.service";
import AddressService from "../components/user/AddressService.service";
import UserService from "../components/user/UserService.service";

export interface IServices {
  address: AddressService;
  administrator: AdministratorService;
  user: UserService;
  /* TODO: implement DB entity services */
}

export default interface IApplicationResources {
  databaseConnection: mysql2.Connection;
  services: IServices;
}
