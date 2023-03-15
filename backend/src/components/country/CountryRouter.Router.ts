import IRouter from "../../common/IRouter.interface";
import * as express from "express";
import IApplicationResources from "../../common/IApplicationResources.interface";
import CountryController from "./CountryController.controller";
import AuthMiddleware from "../../middleware/AuthMiddleware";

export default class CountryRouter implements IRouter {
  public setupRoutes(
    application: express.Application,
    resources: IApplicationResources
  ) {
    const countryController: CountryController = new CountryController(
      resources.services
    );

    application.get(
      "/api/country",
      AuthMiddleware.getVerifier("administrator", "user"),
      countryController.getAll.bind(countryController)
    );

    application.get(
      "/api/country/:cid",
      AuthMiddleware.getVerifier("administrator", "user"),
      countryController.getById.bind(countryController)
    );

    application.get(
      "/api/country/name/:cname",
      AuthMiddleware.getVerifier("administrator", "user"),
      countryController.getByName.bind(countryController)
    );

    application.post(
      "/api/country",
      AuthMiddleware.getVerifier("administrator"),
      countryController.add.bind(countryController)
    );

    application.put(
      "/api/country/:cid",
      AuthMiddleware.getVerifier("administrator"),
      countryController.editById.bind(countryController)
    );

    application.delete(
      "/api/country/:cid",
      AuthMiddleware.getVerifier("administrator"),
      countryController.deleteById.bind(countryController)
    );
  }
}
