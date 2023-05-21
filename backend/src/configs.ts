import IConfig from "./common/IConfig.interface";
import { MailConfigurationParameters } from "./config.mail";
import { readFileSync } from "fs";
import AdministratorRouter from "./components/administrator/AdministratorRouter.router";
import UserRouter from "./components/user/UserRouter.router";
import CountryRouter from "./components/country/CountryRouter.Router";
import AuthRouter from "./components/auth/AuthRouter.router";
import AircraftRouter from "./components/aircraft/AircraftRouter.router";
import "dotenv/config";
import AirportRouter from "./components/airport/AirportRouter.router";
import TicketRouter from "./components/ticket/TicketRouter.Router";
import DocumentRouter from "./components/document/DocumentRouter.Router";
import FlightRouter from "./components/flight/FlightRouter.Router";
import TravelClassRouter from "./components/travel_class/TravelClassRouter.Router";

const offsetToMySQL = (): string => {
  const offsetInMinutes = new Date().getTimezoneOffset();

  const offsetHours = -offsetInMinutes / 60;
  const offsetSign = offsetHours >= 0 ? "+" : "-";
  const offset =
    offsetSign + String(Math.abs(offsetHours)).padStart(2, "0") + ":00";

  return offset;
};

const DevConfig: IConfig = {
  server: {
    port: 10000,
    static: {
      index: false,
      dotfiles: "deny",
      cacheControl: true,
      etag: true,
      maxAge: 1000 * 60 * 60 * 24,
      path: "./static",
      route: "/assets",
    },
  },
  database: {
    host: "localhost",
    port: 3306,
    user: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    database: "diplomski_app",
    charset: "utf8",
    timezone: offsetToMySQL(),
    supportBigNumbers: true,
  },
  routers: [
    new AdministratorRouter(),
    new AircraftRouter(),
    new AirportRouter(),
    new AuthRouter(),
    new CountryRouter(),
    new DocumentRouter(),
    new FlightRouter(),
    new TicketRouter(),
    new TravelClassRouter(),
    new UserRouter(),
  ],
  mail: {
    host: "smtp.gmail.com",
    port: 587,
    email: "",
    password: "",
    debug: true,
  },
  auth: {
    administrator: {
      algorithm: "RS256",
      issuer: "Singidunum University",
      tokens: {
        auth: {
          duration: 60 * 60 * 24,
          keys: {
            public: readFileSync("./.keystore/app.public", "ascii"),
            private: readFileSync("./.keystore/app.private", "ascii"),
          },
        },
        refresh: {
          duration: 60 * 60 * 24 * 30,
          keys: {
            public: readFileSync("./.keystore/app.public", "ascii"),
            private: readFileSync("./.keystore/app.private", "ascii"),
          },
        },
      },
    },
    user: {
      algorithm: "RS256",
      issuer: "Singidunum University",
      tokens: {
        auth: {
          duration: 60 * 60 * 24,
          keys: {
            public: readFileSync("./.keystore/app.public", "ascii"),
            private: readFileSync("./.keystore/app.private", "ascii"),
          },
        },
        refresh: {
          duration: 60 * 60 * 24 * 30,
          keys: {
            public: readFileSync("./.keystore/app.public", "ascii"),
            private: readFileSync("./.keystore/app.private", "ascii"),
          },
        },
      },
    },
    allowAllRoutesWithoutAuthTokens: true,
  },
};

DevConfig.mail = MailConfigurationParameters;

export { DevConfig };
