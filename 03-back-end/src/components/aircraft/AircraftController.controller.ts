import BaseController from "../../common/BaseController";
import { Request, Response } from "express";
import { AddAircraftValidator, IAddAircraftDto } from "./dto/IAddAircraft.dto";
import {
  EditAircraftValidator,
  IEditAircraftDto,
} from "./dto/IEditAircraft.dto";

export default class AircraftController extends BaseController {
  getAll(_req: Request, res: Response) {
    this.services.aircraft
      .getAll({})
      .then((result) => {
        res.send(result);
      })
      .catch((error) => {
        res.status(500).send(error?.message);
      });
  }

  getById(req: Request, res: Response) {
    const aircraftId: number = +req.params?.aid;

    this.services.aircraft
      .getById(aircraftId, {})
      .then((result) => {
        if (result === null) {
          res.status(404).send("The aircraft is not found!");
        }

        res.send(result);
      })
      .catch((error) => {
        res.status(500).send(error?.message);
      });
  }

  getByType(req: Request, res: Response) {
    const type: string = req.params?.atype;

    this.services.aircraft
      .getAircraftByType(type, {})
      .then((result) => {
        if (result === null) {
          res.status(404).send("The aircraft are not found!");
        }

        res.send(result);
      })
      .catch((error) => {
        res.status(500).send(error?.message);
      });
  }

  getByName(req: Request, res: Response) {
    const name: string = req.params?.aname;

    this.services.aircraft
      .getAircraftByName(name, {})
      .then((result) => {
        if (result === null) {
          res.status(404).send("The aircraft is not found!");
        }

        res.send(result);
      })
      .catch((error) => {
        res.status(500).send(error?.message);
      });
  }

  add(req: Request, res: Response) {
    const body = req.body as IAddAircraftDto;

    if (!AddAircraftValidator(body)) {
      return res.status(400).send(AddAircraftValidator.errors);
    }

    this.services.aircraft
      .add({
        type: body.type,
        name: body.name,
      })
      .then((result) => {
        res.send(result);
      })
      .catch((error) => {
        res.status(500).send(error?.message);
      });
  }

  editById(req: Request, res: Response) {
    const aircraftId: number = +req.params?.cid;
    const data = req.body as IEditAircraftDto;

    if (!EditAircraftValidator(data)) {
      return res.status(400).send(EditAircraftValidator.errors);
    }

    this.services.aircraft
      .editById(
        aircraftId,
        {
          type: data.type,
          name: data.name,
        },
        {}
      )
      .then((result) => {
        res.send(result);
      })
      .catch((error) => {
        res.status(500).send(error?.message);
      });
  }

  deleteById(req: Request, res: Response) {
    const aircraftId: number = +req.params?.aid;

    this.services.aircraft
      .getById(aircraftId, {})
      .then((result) => {
        if (result === null) {
          throw {
            status: 404,
            message: "The aircraft is not found!",
          };
        }
      })
      .then(() => {
        return this.services.aircraft.deleteById(aircraftId);
      })
      .then(() => {
        res.send("This aircraft has been deleted!");
      })
      .catch((error) => {
        res.status(error?.status ?? 500).send(error?.message);
      });
  }
}
