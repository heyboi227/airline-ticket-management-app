import BaseController from "../../common/BaseController";
import { Request, Response } from "express";
import IAddTravelClassDto, {
  AddTravelClassValidator,
} from "./dto/IAddTravelClass.dto";
import IEditTravelClassDto, {
  EditTravelClassValidator,
} from "./dto/IEditTravelClass.dto";

export default class TravelClassController extends BaseController {
  getAll(_req: Request, res: Response) {
    this.services.travelClass
      .getAll({})
      .then((result) => {
        res.send(result);
      })
      .catch((error) => {
        res.status(500).send(error?.message ?? "Internal server error!");
      });
  }

  getById(req: Request, res: Response) {
    const travelClassId: number = +req.params?.id;

    this.services.travelClass
      .getById(travelClassId, {})
      .then((result) => {
        if (result === null) {
          throw {
            status: 404,
            message: "Travel class not found!",
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
    const data = req.body as IAddTravelClassDto;

    if (!AddTravelClassValidator(data)) {
      return res.status(400).send(AddTravelClassValidator.errors);
    }

    this.services.travelClass
      .add(data)
      .then((result) => {
        if (result === null) {
          throw {
            status: 400,
            message: "Bad travelClass data given!",
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
    const travelClassId: number = +req.params?.id;
    const data = req.body as IEditTravelClassDto;

    if (!EditTravelClassValidator(data)) {
      return res.status(400).send(EditTravelClassValidator.errors);
    }

    this.services.travelClass
      .getById(travelClassId, {})
      .then((result) => {
        if (result === null) {
          throw {
            status: 404,
            message: "TravelClass not found!",
          };
        }
      })
      .then(() => {
        return this.services.travelClass.editById(travelClassId, data);
      })
      .then((travelClass) => {
        res.send(travelClass);
      })
      .catch((error) => {
        res
          .status(error?.status ?? 500)
          .send(error?.message ?? "Internal server error!");
      });
  }
}
