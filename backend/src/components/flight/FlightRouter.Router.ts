import IRouter from "../../common/IRouter.interface";
import * as express from "express";
import IApplicationResources from "../../common/IApplicationResources.interface";
import FlightController from "./FlightController.controller";
import AuthMiddleware from "../../middleware/AuthMiddleware";

export default class FlightRouter implements IRouter {
  public setupRoutes(
    application: express.Application,
    resources: IApplicationResources
  ) {
    const flightController: FlightController = new FlightController(
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
      "/api/flight/code/:fcode",
      AuthMiddleware.getVerifier("administrator", "user"),
      flightController.getByFlightCode.bind(flightController)
    );

    application.post(
      "/api/flight/search/departure",
      AuthMiddleware.getVerifier("administrator", "user"),
      flightController.getAllByDepartureDateSearchQuery.bind(flightController)
    );

    application.post(
      "/api/flight/search/return",
      AuthMiddleware.getVerifier("administrator", "user"),
      flightController.getAllByReturnDateSearchQuery.bind(flightController)
    );

    application.post(
      "/api/flight",
      AuthMiddleware.getVerifier("administrator"),
      flightController.add.bind(flightController)
    );

    application.put(
      "/api/flight/:fid",
      AuthMiddleware.getVerifier("administrator"),
      flightController.edit.bind(flightController)
    );

    application.delete(
      "/api/flight/:fid",
      AuthMiddleware.getVerifier("administrator"),
      flightController.delete.bind(flightController)
    );
  }
}
