import * as express from "express";
import ApplicationResources from "../../common/ApplicationResources.interface";
import Router from "../../common/Router.interface";
import AuthMiddleware from "../../middleware/AuthMiddleware";
import AdministratorController from "./AdministratorController.controller";

export default class AdministratorRouter implements Router {
  public setupRoutes(
    application: express.Application,
    resources: ApplicationResources
  ) {
    const administratorController: AdministratorController =
      new AdministratorController(resources.services);

    application.get(
      "/api/administrator",
      AuthMiddleware.getVerifier("administrator"),
      administratorController.getAll.bind(administratorController)
    );

    application.get(
      "/api/administrator/:aid",
      AuthMiddleware.getVerifier("administrator"),
      administratorController.getById.bind(administratorController)
    );

    application.get(
      "/api/administrator/username/:ausername",
      AuthMiddleware.getVerifier("administrator"),
      administratorController.getByUsername.bind(administratorController)
    );

    application.post(
      "/api/administrator",
      AuthMiddleware.getVerifier("administrator"),
      administratorController.add.bind(administratorController)
    );

    application.put(
      "/api/administrator/:aid",
      AuthMiddleware.getVerifier("administrator"),
      administratorController.editById.bind(administratorController)
    );
  }
}
