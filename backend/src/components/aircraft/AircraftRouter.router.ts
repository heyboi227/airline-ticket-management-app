import Router from "../../common/Router.interface";
import * as express from "express";
import ApplicationResources from "../../common/ApplicationResources.interface";
import AircraftController from "./AircraftController.controller";
import AuthMiddleware from "../../middleware/AuthMiddleware";

export default class AircraftRouter implements Router {
  public setupRoutes(
    application: express.Application,
    resources: ApplicationResources
  ) {
    const aircraftController: AircraftController = new AircraftController(
      resources.services
    );

    application.get(
      "/api/aircraft",
      AuthMiddleware.getVerifier("administrator", "user"),
      aircraftController.getAll.bind(aircraftController)
    );

    application.get(
      "/api/aircraft/:aid",
      AuthMiddleware.getVerifier("administrator", "user"),
      aircraftController.getById.bind(aircraftController)
    );

    application.get(
      "/api/aircraft/type/:atype",
      AuthMiddleware.getVerifier("administrator", "user"),
      aircraftController.getAllByAircraftType.bind(aircraftController)
    );

    application.get(
      "/api/aircraft/name/:aname",
      AuthMiddleware.getVerifier("administrator", "user"),
      aircraftController.getByAircraftName.bind(aircraftController)
    );

    application.post(
      "/api/aircraft",
      AuthMiddleware.getVerifier("administrator"),
      aircraftController.add.bind(aircraftController)
    );

    application.put(
      "/api/aircraft/:aid",
      AuthMiddleware.getVerifier("administrator"),
      aircraftController.editById.bind(aircraftController)
    );

    application.delete(
      "/api/aircraft/:aid",
      AuthMiddleware.getVerifier("administrator"),
      aircraftController.deleteById.bind(aircraftController)
    );
  }
}
