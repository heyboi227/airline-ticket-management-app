import * as express from "express";
import ApplicationResources from "../../common/ApplicationResources.interface";
import Router from "../../common/Router.interface";
import AuthController from "./AuthController.controller";

class AuthRouter implements Router {
  public setupRoutes(
    application: express.Application,
    resources: ApplicationResources
  ) {
    const authController: AuthController = new AuthController(
      resources.services
    );

    application.post(
      "/api/auth/administrator/login",
      authController.administratorLogin.bind(authController)
    );

    application.post(
      "/api/auth/administrator/refresh",
      authController.administratorRefresh.bind(authController)
    );

    application.post(
      "/api/auth/user/login",
      authController.userLogin.bind(authController)
    );

    application.post(
      "/api/auth/user/refresh",
      authController.userRefresh.bind(authController)
    );
  }
}

export default AuthRouter;
