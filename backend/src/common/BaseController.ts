import { Services } from "./ApplicationResources.interface";

export default abstract class BaseController {
  private serviceInstances: Services;

  constructor(services: Services) {
    this.serviceInstances = services;
  }

  protected get services(): Services {
    return this.serviceInstances;
  }
}
