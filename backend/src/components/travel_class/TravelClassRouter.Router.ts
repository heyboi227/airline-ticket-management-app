import * as express from "express";
import IApplicationResources from "../../common/IApplicationResources.interface";
import IRouter from "../../common/IRouter.interface";
import AuthMiddleware from "../../middleware/AuthMiddleware";
import TravelClassController from "./TravelClassController.controller";

class TravelClassRouter implements IRouter {
  public setupRoutes(
    application: express.Application,
    resources: IApplicationResources
  ) {
    const travelClassController: TravelClassController =
      new TravelClassController(resources.services);

    application.get(
      "/api/travel-class",
      AuthMiddleware.getVerifier("administrator", "user"),
      travelClassController.getAll.bind(travelClassController)
    );

    application.get(
      "/api/travel-class/:id",
      AuthMiddleware.getVerifier("administrator", "user"),
      travelClassController.getById.bind(travelClassController)
    );

    application.post(
      "/api/travel-class",
      AuthMiddleware.getVerifier("administrator"),
      travelClassController.add.bind(travelClassController)
    );
    
    application.put(
      "/api/travel-class/:id",
      AuthMiddleware.getVerifier("administrator"),
      travelClassController.editById.bind(travelClassController)
    );
  }
}

export default TravelClassRouter;
