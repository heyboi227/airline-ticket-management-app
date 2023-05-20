import BaseController from "../../common/BaseController";
import { Request, Response } from "express";
import IAddTravelClassDto, {
  AddTravelClassValidator,
} from "./dto/IAddTravelClass.dto";
import IEditTravelClass, {
  EditTravelClassValidator,
  IEditTravelClassDto,
} from "./dto/IEditTravelClass.dto";
import StatusError from "../../common/StatusError";

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
          throw new StatusError(404, "Travel class not found!");
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
          throw new StatusError(400, "Bad travel class data given!");
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

    const serviceData: IEditTravelClass = {};

    if (data.travelClassName !== undefined) {
      serviceData.name = data.travelClassName;
    }

    if (data.travelClassSubname !== undefined) {
      serviceData.subname = data.travelClassSubname;
    }

    this.services.travelClass
      .getById(travelClassId, {})
      .then((result) => {
        if (result === null) {
          throw new StatusError(404, "Travel class not found!");
        }
      })
      .then(() => {
        return this.services.travelClass.editById(travelClassId, serviceData);
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
