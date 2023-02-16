import IRouter from "../../common/IRouter.interface";
import * as express from "express";
import IApplicationResources from "../../common/IApplicationResources.interface";
import DocumentController from "./DocumentController.controller";
import AuthMiddleware from "../../middleware/AuthMiddleware";

export default class DocumentRouter implements IRouter {
  public setupRoutes(
    application: express.Application,
    resources: IApplicationResources
  ) {
    const documentController: DocumentController = new DocumentController(
      resources.services
    );

    application.get(
      "/api/document",
      AuthMiddleware.getVerifier("administrator"),
      documentController.getAll.bind(documentController)
    );

    application.get(
      "/api/document/:did",
      AuthMiddleware.getVerifier("administrator", "user"),
      documentController.getById.bind(documentController)
    );

    application.get(
      "/api/document/number/:dnum",
      AuthMiddleware.getVerifier("administrator", "user"),
      documentController.getByDocumentNumber.bind(documentController)
    );

    application.post(
      "/api/document",
      AuthMiddleware.getVerifier("user"),
      documentController.add.bind(documentController)
    );

    application.delete(
      "/api/document/:did",
      AuthMiddleware.getVerifier("user"),
      documentController.deleteById.bind(documentController)
    );
  }
}
