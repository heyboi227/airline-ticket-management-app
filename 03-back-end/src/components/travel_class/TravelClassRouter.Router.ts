import IRouter from "../../common/IRouter.interface";
import * as express from "express";
import IApplicationResources from "../../common/IApplicationResources.interface";
import TravelClassController from "./TravelClassController.controller";
import AuthMiddleware from "../../middlewares/AuthMiddleware";

export default class TravelClassRouter implements IRouter {
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
  }
}
