import * as express from "express";
import IApplicationResources from "../../common/IApplicationResources.interface";
import IRouter from "../../common/IRouter.interface";
import AuthMiddleware from "../../middlewares/AuthMiddleware";
import BagController from "./BagController.controller";

class BagRouter implements IRouter {
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

    application.get(
      "/api/bag/:bid",
      AuthMiddleware.getVerifier("administrator", "user"),
      bagController.getById.bind(bagController)
    );

    application.post(
      "/api/bag",
      AuthMiddleware.getVerifier("administrator"),
      bagController.add.bind(bagController)
    );

    application.put(
      "/api/bag/:bid",
      AuthMiddleware.getVerifier("administrator"),
      bagController.editById.bind(bagController)
    );
  }
}

export default BagRouter;
