import BaseController from "../../common/BaseController";
import { Request, Response } from "express";
import { AddAircraftValidator, IAddAircraftDto } from "./dto/IAddAircraft.dto";
import {
  EditAircraftValidator,
  IEditAircraft,
  IEditAircraftDto,
} from "./dto/IEditAircraft.dto";
import StatusError from "../../common/StatusError";
import escapeHTML = require("escape-html");

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
          throw new StatusError(404, "The aircraft is not found!");
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
          throw new StatusError(404, "The aircraft are not found!");
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
          throw new StatusError(404, "The aircraft is not found!");
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
          type: body.aircraftType,
          name: body.aircraftName,
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
      const safeOutput = escapeHTML(
        JSON.stringify(EditAircraftValidator.errors)
      );
      return res.status(400).send(safeOutput);
    }

    const serviceData: IEditAircraft = {};

    if (data.aircraftName !== undefined) {
      serviceData.name = data.aircraftName;
    }

    if (data.aircraftType !== undefined) {
      serviceData.type = data.aircraftType;
    }

    this.services.aircraft
      .startTransaction()
      .then(() => {
        return this.services.aircraft.editById(aircraftId, serviceData);
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
          throw new StatusError(404, "The aircraft is not found!");
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
