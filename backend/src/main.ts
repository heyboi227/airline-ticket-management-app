import * as express from "express";
import * as cors from "cors";
import IConfig from "./common/IConfig.interface";
import { DevConfig } from "./configs";
import IApplicationResources from "./common/IApplicationResources.interface";
import * as mysql2 from "mysql2/promise";
import AddressService from "./components/user/AddressService.service";
import AdministratorService from "./components/administrator/AdministratorService.service";
import UserService from "./components/user/UserService.service";
import CountryService from "./components/country/CountryService.service";
import AircraftService from "./components/aircraft/AircraftService.service";
import TravelClassService from "./components/travel_class/TravelClassService.service";
import FlightService from "./components/flight/FlightService.service";
import AirportService from "./components/airport/AirportService.service";
import DocumentService from "./components/document/DocumentService.service";
import TicketService from "./components/ticket/TicketService.service";

async function main() {
  const config: IConfig = DevConfig;

  let db = await mysql2.createConnection({
    host: config.database.host,
    port: config.database.port,
    user: config.database.user,
    password: config.database.password,
    database: config.database.database,
    charset: config.database.charset,
    timezone: config.database.timezone,
    supportBigNumbers: config.database.supportBigNumbers,
  });

  async function createAndMonitorConnection(): Promise<mysql2.Connection> {
    attactConnectionMonitoring(db);
    return db;
  }

  async function handleErrorAndReconnect(
    db: mysql2.Connection,
    error: mysql2.QueryError
  ): Promise<void> {
    if (!error.fatal) {
      return;
    }

    if (error?.code !== "PROTOCOL_CONNECTION_LOST") {
      throw error;
    }

    console.log("Reconnecting to the database server...");

    db.end().catch((error) => console.error("An error occured: ", error));

    db = await createAndMonitorConnection();

    db.connect().catch((error) => console.error("An error occured: ", error));
  }

  function attactConnectionMonitoring(db: mysql2.Connection) {
    db.on("error", (error) => {
      handleErrorAndReconnect(db, error).catch((error) => {
        console.error("Failed to reconnect: ", error);
      });
    });
  }

  attactConnectionMonitoring(db);

  const applicationResources: IApplicationResources = {
    databaseConnection: db,
    services: {
      address: null,
      administrator: null,
      aircraft: null,
      airport: null,
      country: null,
      document: null,
      flight: null,
      ticket: null,
      travelClass: null,
      user: null,
    },
  };

  applicationResources.services.address = new AddressService(
    applicationResources
  );
  applicationResources.services.administrator = new AdministratorService(
    applicationResources
  );
  applicationResources.services.aircraft = new AircraftService(
    applicationResources
  );
  applicationResources.services.airport = new AirportService(
    applicationResources
  );
  applicationResources.services.country = new CountryService(
    applicationResources
  );
  applicationResources.services.document = new DocumentService(
    applicationResources
  );
  applicationResources.services.flight = new FlightService(
    applicationResources
  );
  applicationResources.services.ticket = new TicketService(
    applicationResources
  );
  applicationResources.services.travelClass = new TravelClassService(
    applicationResources
  );
  applicationResources.services.user = new UserService(applicationResources);

  const application: express.Application = express();

  application.use(
    cors({
      origin: function (
        origin: string | undefined,
        callback: (err: Error | null, allow?: boolean) => void
      ) {
        if (["http://127.0.0.1"].indexOf(origin) !== -1) {
          callback(null, true);
        } else {
          callback(new Error("Not allowed by CORS!"));
        }
      },
    })
  );

  application.use(express.urlencoded({ extended: true }));

  application.use(express.json());

  application.use(
    config.server.static.route,
    express.static(config.server.static.path, {
      index: config.server.static.index,
      dotfiles: config.server.static.dotfiles,
      cacheControl: config.server.static.cacheControl,
      etag: config.server.static.etag,
      maxAge: config.server.static.maxAge,
    })
  );

  for (const router of config.routers) {
    router.setupRoutes(application, applicationResources);
  }

  application.use((_req, res) => {
    res.sendStatus(404);
  });

  async function updateFlightStatus() {
    try {
      const currentDate = new Date().toISOString().slice(0, 10);

      const query =
        "UPDATE `flight_travel_class` SET `is_active` = 0 WHERE `flight_id` IN (SELECT `flight_id` FROM `flight` WHERE `departure_date_and_time` < ? OR `arrival_date_and_time` < ?);";

      await db.execute(query, [currentDate, currentDate]);

      console.log(`Flights updated on ${currentDate}`);
    } catch (error) {
      console.error("Error updating flights:", error);
    }
  }

  async function scheduleUpdate() {
    await updateFlightStatus();
  }

  await scheduleUpdate();

  application.listen(config.server.port);
}

process.on("uncaughtException", (error) => {
  console.error("Error:", error);
});

await main();
