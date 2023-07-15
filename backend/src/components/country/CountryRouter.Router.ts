import Router from "../../common/Router.interface";
import * as express from "express";
import ApplicationResources from "../../common/ApplicationResources.interface";
import CountryController from "./CountryController.controller";
import AuthMiddleware from "../../middleware/AuthMiddleware";

export default class CountryRouter implements Router {
  public setupRoutes(
    application: express.Application,
    resources: ApplicationResources
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

    application.get(
      "/api/country/search/:sstring",
      AuthMiddleware.getVerifier("administrator", "user"),
      countryController.getAllBySearchString.bind(countryController)
    );
  }
}
