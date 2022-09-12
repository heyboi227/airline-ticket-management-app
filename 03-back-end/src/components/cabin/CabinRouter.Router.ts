import IRouter from "../../common/IRouter.interface";
import * as express from "express";
import IApplicationResources from "../../common/IApplicationResources.interface";
import CabinController from "./CabinController.controller";
import AuthMiddleware from "../../middlewares/AuthMiddleware";

export default class CabinRouter implements IRouter {
  public setupRoutes(
    application: express.Application,
    resources: IApplicationResources
  ) {
    const cabinController: CabinController = new CabinController(
      resources.services
    );

    application.get(
      "/api/cabin",
      AuthMiddleware.getVerifier("administrator", "user"),
      cabinController.getAll.bind(cabinController)
    );
  }
}
