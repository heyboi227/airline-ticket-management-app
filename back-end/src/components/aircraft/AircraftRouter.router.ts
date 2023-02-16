import IRouter from "../../common/IRouter.interface";
import * as express from "express";
import IApplicationResources from "../../common/IApplicationResources.interface";
import AircraftController from "./AircraftController.controller";
import AuthMiddleware from "../../middleware/AuthMiddleware";

export default class AircraftRouter implements IRouter {
  public setupRoutes(
    application: express.Application,
    resources: IApplicationResources
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
      aircraftController.getAllByType.bind(aircraftController)
    );

    application.get(
      "/api/aircraft/name/:aname",
      AuthMiddleware.getVerifier("administrator", "user"),
      aircraftController.getByName.bind(aircraftController)
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
