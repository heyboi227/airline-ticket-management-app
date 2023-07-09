import * as express from "express";
import ApplicationResources from "./ApplicationResources.interface";

export default interface Router {
  setupRoutes(
    application: express.Application,
    resources: ApplicationResources
  ): void;
}
