import BaseController from "../../common/BaseController";
import { Request, Response } from "express";

export default class CabinController extends BaseController {
  getAll(_req: Request, res: Response) {
    this.services.cabin
      .startTransaction()
      .then(() => {
        return this.services.cabin.getAll({});
      })
      .then(async (result) => {
        await this.services.cabin.commitChanges();
        res.send(result);
      })
      .catch(async (error) => {
        await this.services.cabin.rollbackChanges();
        setTimeout(() => {
          res.status(500).send(error?.message);
        }, 300);
      });
  }
}
