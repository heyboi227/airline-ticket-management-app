import Router from "../../common/Router.interface";
import * as express from "express";
import ApplicationResources from "../../common/ApplicationResources.interface";
import AirportController from "./AirportController.controller";
import AuthMiddleware from "../../middleware/AuthMiddleware";

export default class AirportRouter implements Router {
  public setupRoutes(
    application: express.Application,
    resources: ApplicationResources
  ) {
    const airportController: AirportController = new AirportController(
      resources.services
    );

    application.get(
      "/api/airport",
      AuthMiddleware.getVerifier("administrator", "user"),
      airportController.getAll.bind(airportController)
    );

    application.get(
      "/api/airport/:aid",
      AuthMiddleware.getVerifier("administrator", "user"),
      airportController.getById.bind(airportController)
    );

    application.get(
      "/api/airport/code/:acode",
      AuthMiddleware.getVerifier("administrator", "user"),
      airportController.getByAirportCode.bind(airportController)
    );

    application.get(
      "/api/airport/name/:aname",
      AuthMiddleware.getVerifier("administrator", "user"),
      airportController.getByName.bind(airportController)
    );

    application.get(
      "/api/airport/city/:acity",
      AuthMiddleware.getVerifier("administrator", "user"),
      airportController.getAllByCity.bind(airportController)
    );

    application.get(
      "/api/airport/country/:cid",
      AuthMiddleware.getVerifier("administrator", "user"),
      airportController.getAllByCountryId.bind(airportController)
    );

    application.get(
      "/api/airport/search/:sstring",
      airportController.getAllBySearchString.bind(airportController)
    );

    application.post(
      "/api/airport",
      AuthMiddleware.getVerifier("administrator"),
      airportController.add.bind(airportController)
    );

    application.put(
      "/api/airport/:aid",
      AuthMiddleware.getVerifier("administrator"),
      airportController.editById.bind(airportController)
    );

    application.delete(
      "/api/airport/:aid",
      AuthMiddleware.getVerifier("administrator"),
      airportController.deleteById.bind(airportController)
    );
  }
}
