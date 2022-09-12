import BaseController from "../../common/BaseController";
import { Request, Response } from "express";

export default class CabinController extends BaseController {
  getAll(_req: Request, res: Response) {
    this.services.cabin
      .getAll({})
      .then((result) => {
        res.send(result);
      })
      .catch((error) => {
        setTimeout(() => {
          res.status(500).send(error?.message);
        }, 300);
      });
  }
}
