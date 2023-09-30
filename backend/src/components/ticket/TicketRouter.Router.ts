import Router from "../../common/Router.interface";
import * as express from "express";
import ApplicationResources from "../../common/ApplicationResources.interface";
import TicketController from "./TicketController.controller";
import AuthMiddleware from "../../middleware/AuthMiddleware";

export default class TicketRouter implements Router {
  public setupRoutes(
    application: express.Application,
    resources: ApplicationResources
  ) {
    const ticketController: TicketController = new TicketController(
      resources.services
    );

    application.get(
      "/api/ticket/:tid",
      AuthMiddleware.getVerifier("administrator", "user"),
      ticketController.getById.bind(ticketController)
    );

    application.get(
      "/api/ticket/number/:tnum",
      AuthMiddleware.getVerifier("administrator", "user"),
      ticketController.getByTicketNumber.bind(ticketController)
    );

    application.get(
      "/api/ticket/user/:uid",
      AuthMiddleware.getVerifier("administrator", "user"),
      ticketController.getAllByUserId.bind(ticketController)
    );

    application.get(
      "/api/ticket/flight/:fid",
      AuthMiddleware.getVerifier("administrator", "user"),
      ticketController.getAllByFlightId.bind(ticketController)
    );

    application.post(
      "/api/ticket",
      AuthMiddleware.getVerifier("user"),
      ticketController.add.bind(ticketController)
    );

    application.post(
      "/api/ticket/confirm-booking",
      AuthMiddleware.getVerifier("user"),
      ticketController.bookingConfirmationEmailSend.bind(ticketController)
    );

    application.post(
      "/api/ticket/search",
      AuthMiddleware.getVerifier("administrator", "user"),
      ticketController.getAllByFlightIdAndSeatNumber.bind(ticketController)
    );
  }
}
