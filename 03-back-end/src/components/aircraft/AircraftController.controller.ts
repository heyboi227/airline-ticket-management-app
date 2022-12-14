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
        setTimeout(() => {
          res.status(500).send(error?.message);
        }, 500);
      });
  }

  getById(req: Request, res: Response) {
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

        res.send(result);
      })
      .catch((error) => {
        setTimeout(() => {
          res.status(error?.status ?? 500).send(error?.message);
        }, 500);
      });
  }

  getAllByType(req: Request, res: Response) {
    const type: string = req.params?.atype;

    this.services.aircraft
      .getAllByType(type)
      .then((result) => {
        if (result === null) {
          throw {
            status: 404,
            message: "The aircraft are not found!",
          };
        }

        res.send(result);
      })
      .catch((error) => {
        setTimeout(() => {
          res.status(error?.status ?? 500).send(error?.message);
        }, 500);
      });
  }

  getByName(req: Request, res: Response) {
    const name: string = req.params?.aname;

    this.services.aircraft
      .getByName(name)
      .then((result) => {
        if (result === null) {
          throw {
            status: 404,
            message: "The aircraft is not found!",
          };
        }

        res.send(result);
      })
      .catch((error) => {
        setTimeout(() => {
          res.status(error?.status ?? 500).send(error?.message);
        }, 500);
      });
  }

  add(req: Request, res: Response) {
    const body = req.body as IAddAircraftDto;

    if (!AddAircraftValidator(body)) {
      return res.status(400).send(AddAircraftValidator.errors);
    }

    this.services.aircraft
      .startTransaction()
      .then(() => {
        return this.services.aircraft.add({
          type: body.type,
          name: body.name,
        });
      })
      .then(async (result) => {
        await this.services.aircraft.commitChanges();
        res.send(result);
      })
      .catch(async (error) => {
        await this.services.aircraft.rollbackChanges();
        setTimeout(() => {
          res.status(500).send(error?.message);
        }, 500);
      });
  }

  editById(req: Request, res: Response) {
    const aircraftId: number = +req.params?.aid;
    const data = req.body as IEditAircraftDto;

    if (!EditAircraftValidator(data)) {
      return res.status(400).send(EditAircraftValidator.errors);
    }

    this.services.aircraft
      .startTransaction()
      .then(() => {
        return this.services.aircraft.editById(aircraftId, {
          type: data.type,
          name: data.name,
        });
      })
      .then(async (result) => {
        await this.services.aircraft.commitChanges();
        res.send(result);
      })
      .catch(async (error) => {
        await this.services.aircraft.rollbackChanges();
        setTimeout(() => {
          res.status(500).send(error?.message);
        }, 500);
      });
  }

  deleteById(req: Request, res: Response) {
    const aircraftId: number = +req.params?.aid;

    this.services.aircraft
      .startTransaction()
      .then(() => {
        return this.services.aircraft.getById(aircraftId, {});
      })
      .then((result) => {
        if (result === null) {
          throw {
            status: 404,
            message: "The aircraft is not found!",
          };
        }
      })
      .then(async () => {
        await this.services.aircraft.commitChanges();
        return this.services.aircraft.deleteById(aircraftId);
      })
      .then(() => {
        res.send("This aircraft has been deleted!");
      })
      .catch(async (error) => {
        await this.services.aircraft.rollbackChanges();
        setTimeout(() => {
          res.status(error?.status ?? 500).send(error?.message);
        }, 500);
      });
  }
}
