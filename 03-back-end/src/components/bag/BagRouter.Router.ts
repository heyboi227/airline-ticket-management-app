import IRouter from "../../common/IRouter.interface";
import * as express from "express";
import IApplicationResources from "../../common/IApplicationResources.interface";
import BagController from "./BagController.controller";
import AuthMiddleware from "../../middlewares/AuthMiddleware";

export default class BagRouter implements IRouter {
  public setupRoutes(
    application: express.Application,
    resources: IApplicationResources
  ) {
    const bagController: BagController = new BagController(resources.services);

    application.get(
      "/api/bag",
      AuthMiddleware.getVerifier("administrator", "user"),
      bagController.getAll.bind(bagController)
    );
  }
}
