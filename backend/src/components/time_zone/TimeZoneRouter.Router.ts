import IRouter from "../../common/IRouter.interface";
import * as express from "express";
import IApplicationResources from "../../common/IApplicationResources.interface";
import TimeZoneController from "./TimeZoneController.controller";
import AuthMiddleware from "../../middleware/AuthMiddleware";

export default class TimeZoneRouter implements IRouter {
  public setupRoutes(
    application: express.Application,
    resources: IApplicationResources
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
