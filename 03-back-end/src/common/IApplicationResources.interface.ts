import * as mysql2 from "mysql2/promise";
import AdministratorService from "../components/administrator/AdministratorService.service";

export interface IServices {
  administrator: AdministratorService;
  /* TODO: implement DB entity services */
}

export default interface IApplicationResources {
  databaseConnection: mysql2.Connection;
  services: IServices;
}
