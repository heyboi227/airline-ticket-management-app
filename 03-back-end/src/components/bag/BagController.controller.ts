import BaseController from "../../common/BaseController";
import { Request, Response } from "express";
import IAddBagDto, { AddBagValidator } from "./dto/IAddBag.dto";
import IEditBagDto, { EditBagValidator } from "./dto/IEditBag.dto";

export default class BagController extends BaseController {
  getAll(_req: Request, res: Response) {
    this.services.bag
      .getAll({})
      .then((result) => {
        res.send(result);
      })
      .catch((error) => {
        res.status(500).send(error?.message ?? "Internal server error!");
      });
  }

  getById(req: Request, res: Response) {
    const bagId: number = +req.params?.id;

    this.services.bag
      .getById(bagId, {})
      .then((result) => {
        if (result === null) {
          throw {
            status: 404,
            message: "Bag not found!",
          };
        }

        return result;
      })
      .then((result) => {
        res.send(result);
      })
      .catch((error) => {
        res
          .status(error?.status ?? 500)
          .send(error?.message ?? "Internal server error!");
      });
  }

  add(req: Request, res: Response) {
    const data = req.body as IAddBagDto;

    if (!AddBagValidator(data)) {
      return res.status(400).send(AddBagValidator.errors);
    }

    this.services.bag
      .add(data)
      .then((result) => {
        if (result === null) {
          throw {
            status: 400,
            message: "Bad bag data given!",
          };
        }

        return result;
      })
      .then((result) => {
        res.send(result);
      })
      .catch((error) => {
        res
          .status(error?.status ?? 500)
          .send(error?.message ?? "Internal server error!");
      });
  }

  editById(req: Request, res: Response) {
    const bagId: number = +req.params?.id;
    const data = req.body as IEditBagDto;

    if (!EditBagValidator(data)) {
      return res.status(400).send(EditBagValidator.errors);
    }

    this.services.bag
      .getById(bagId, {})
      .then((result) => {
        if (result === null) {
          throw {
            status: 404,
            message: "Bag not found!",
          };
        }
      })
      .then(() => {
        return this.services.bag.editById(bagId, data);
      })
      .then((bag) => {
        res.send(bag);
      })
      .catch((error) => {
        res
          .status(error?.status ?? 500)
          .send(error?.message ?? "Internal server error!");
      });
  }
}
