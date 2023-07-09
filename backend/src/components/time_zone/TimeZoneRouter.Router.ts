import Router from "../../common/Router.interface";
import * as express from "express";
import ApplicationResources from "../../common/ApplicationResources.interface";
import TimeZoneController from "./TimeZoneController.controller";
import AuthMiddleware from "../../middleware/AuthMiddleware";

export default class TimeZoneRouter implements Router {
  public setupRoutes(
    application: express.Application,
    resources: ApplicationResources
  ) {
    const timeZoneController: TimeZoneController = new TimeZoneController(
      resources.services
    );

    application.get(
      "/api/time-zone",
      AuthMiddleware.getVerifier("administrator", "user"),
      timeZoneController.getAll.bind(timeZoneController)
    );

    application.get(
      "/api/time-zone/:tzid",
      AuthMiddleware.getVerifier("administrator", "user"),
      timeZoneController.getById.bind(timeZoneController)
    );

    application.get(
      "/api/time-zone/name/:tzname",
      AuthMiddleware.getVerifier("administrator", "user"),
      timeZoneController.getByName.bind(timeZoneController)
    );

    application.post(
      "/api/time-zone",
      AuthMiddleware.getVerifier("administrator"),
      timeZoneController.add.bind(timeZoneController)
    );

    application.put(
      "/api/time-zone/:tzid",
      AuthMiddleware.getVerifier("administrator"),
      timeZoneController.editById.bind(timeZoneController)
    );

    application.delete(
      "/api/time-zone/:tzid",
      AuthMiddleware.getVerifier("administrator"),
      timeZoneController.deleteById.bind(timeZoneController)
    );
  }
}
