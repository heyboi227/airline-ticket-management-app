import IRouter from "../../common/IRouter.interface";
import * as express from "express";
import IApplicationResources from "../../common/IApplicationResources.interface";
import FlightController from "./FlightController.controller";
import AuthMiddleware from "../../middleware/AuthMiddleware";
import FlightLegController from "../flight_leg/FlightLegController.controller";

export default class FlightRouter implements IRouter {
  public setupRoutes(
    application: express.Application,
    resources: IApplicationResources
  ) {
    const flightController: FlightController = new FlightController(
      resources.services
    );
    const flightLegController: FlightLegController = new FlightLegController(
      resources.services
    );

    application.get(
      "/api/flight",
      AuthMiddleware.getVerifier("administrator", "user"),
      flightController.getAll.bind(flightController)
    );

    application.get(
      "/api/flight/:fid",
      AuthMiddleware.getVerifier("administrator", "user"),
      flightController.getById.bind(flightController)
    );

    application.get(
      "/api/flight/fare-code/:fcode",
      AuthMiddleware.getVerifier("administrator", "user"),
      flightController.getByFlightFareCode.bind(flightController)
    );

    application.post(
      "/api/flight",
      AuthMiddleware.getVerifier("administrator"),
      flightController.add.bind(flightController)
    );

    application.put(
      "/api/flight/:fid",
      AuthMiddleware.getVerifier("administrator"),
      flightController.editById.bind(flightController)
    );

    application.get(
      "/api/flight/:fid/flight-leg",
      AuthMiddleware.getVerifier("administrator", "user"),
      flightLegController.getAllFlightLegsByFlightId.bind(flightLegController)
    );

    application.get(
      "/api/flight/:fid/flight-leg/:flid",
      AuthMiddleware.getVerifier("administrator", "user"),
      flightLegController.getFlightLegById.bind(flightLegController)
    );

    application.post(
      "/api/flight/:fid/flight-leg",
      AuthMiddleware.getVerifier("administrator"),
      flightLegController.add.bind(flightLegController)
    );

    application.put(
      "/api/flight/:fid/flight-leg/:flid",
      AuthMiddleware.getVerifier("administrator"),
      flightLegController.editById.bind(flightLegController)
    );

    application.delete(
      "/api/flight/:fid/flight-leg/:flid",
      AuthMiddleware.getVerifier("administrator"),
      flightLegController.deleteById.bind(flightLegController)
    );
  }
}
