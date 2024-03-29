import * as express from "express";
import ApplicationResources from "../../common/ApplicationResources.interface";
import Router from "../../common/Router.interface";
import AuthMiddleware from "../../middleware/AuthMiddleware";
import UserController from "./UserController.controller";

class UserRouter implements Router {
  public setupRoutes(
    application: express.Application,
    resources: ApplicationResources
  ) {
    const userController: UserController = new UserController(
      resources.services
    );

    application.get(
      "/api/user",
      AuthMiddleware.getVerifier("administrator"),
      userController.getAll.bind(userController)
    );

    application.get(
      "/api/user/:uid",
      AuthMiddleware.getVerifier("administrator", "user"),
      userController.getById.bind(userController)
    );

    application.post(
      "/api/user/register",
      userController.register.bind(userController)
    );

    application.put(
      "/api/user/:uid",
      AuthMiddleware.getVerifier("administrator", "user"),
      userController.editById.bind(userController)
    );

    application.get(
      "/api/user/activate/:acode",
      userController.activate.bind(userController)
    );

    application.post(
      "/api/user/reset-password",
      userController.passwordResetEmailSend.bind(userController)
    );

    application.get(
      "/api/user/reset/:rcode",
      userController.resetPassword.bind(userController)
    );

    application.post(
      "/api/user/address",
      AuthMiddleware.getVerifier("user"),
      userController.addAddress.bind(userController)
    );

    application.put(
      "/api/user/address/:aid",
      AuthMiddleware.getVerifier("user"),
      userController.editAddressById.bind(userController)
    );
  }
}

export default UserRouter;
