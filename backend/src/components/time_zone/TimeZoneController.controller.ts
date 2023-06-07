import BaseController from "../../common/BaseController";
import { Request, Response } from "express";
import { AddTimeZoneValidator, IAddTimeZoneDto } from "./dto/IAddTimeZone.dto";
import {
  EditTimeZoneValidator,
  IEditTimeZoneDto,
} from "./dto/IEditTimeZone.dto";
import StatusError from "../../common/StatusError";
import escapeHTML = require("escape-html");

export default class TimeZoneController extends BaseController {
  getAll(_req: Request, res: Response) {
    this.services.timeZone
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

  getById(req: Request, res: Response) {
    const timeZoneId: number = +req.params?.tzid;

    this.services.timeZone
      .getById(timeZoneId, {})
      .then((result) => {
        if (result === null) {
          throw new StatusError(404, "The time zone is not found!");
        }

        res.send(result);
      })
      .catch((error) => {
        setTimeout(() => {
          res.status(error?.status ?? 500).send(error?.message);
        }, 300);
      });
  }

  getByName(req: Request, res: Response) {
    const name: string = req.params?.tzname;

    this.services.timeZone
      .getByTimeZoneName(name)
      .then((result) => {
        if (result === null) {
          throw new StatusError(404, "The time zone is not found!");
        }

        res.send(result);
      })
      .catch((error) => {
        setTimeout(() => {
          res.status(error?.status ?? 500).send(error?.message);
        }, 300);
      });
  }

  add(req: Request, res: Response) {
    const body = req.body as IAddTimeZoneDto;

    if (!AddTimeZoneValidator(body)) {
      const safeOutput = escapeHTML(
        JSON.stringify(AddTimeZoneValidator.errors)
      );
      return res.status(400).send(safeOutput);
    }

    this.services.timeZone
      .startTransaction()
      .then(() => {
        return this.services.timeZone.add({
          time_zone_name: body.timeZoneName,
        });
      })
      .then(async (result) => {
        await this.services.timeZone.commitChanges();
        res.send(result);
      })
      .catch(async (error) => {
        await this.services.timeZone.rollbackChanges();
        setTimeout(() => {
          res.status(500).send(error?.message);
        }, 300);
      });
  }

  editById(req: Request, res: Response) {
    const timeZoneId: number = +req.params?.tzid;
    const data = req.body as IEditTimeZoneDto;

    if (!EditTimeZoneValidator(data)) {
      const safeOutput = escapeHTML(
        JSON.stringify(EditTimeZoneValidator.errors)
      );
      return res.status(400).send(safeOutput);
    }

    this.services.timeZone
      .startTransaction()
      .then(() => {
        return this.services.timeZone.editById(timeZoneId, {
          time_zone_name: data.timeZoneName,
        });
      })
      .then(async (result) => {
        await this.services.timeZone.commitChanges();
        res.send(result);
      })
      .catch(async (error) => {
        await this.services.timeZone.rollbackChanges();
        setTimeout(() => {
          res.status(500).send(error?.message);
        }, 300);
      });
  }

  deleteById(req: Request, res: Response) {
    const timeZoneId: number = +req.params?.tzid;

    this.services.timeZone
      .startTransaction()
      .then(() => {
        return this.services.timeZone.getById(timeZoneId, {});
      })
      .then((result) => {
        if (result === null) {
          throw new StatusError(404, "The time zone is not found!");
        }
      })
      .then(async () => {
        await this.services.timeZone.commitChanges();
        return this.services.timeZone.deleteById(timeZoneId);
      })
      .then(() => {
        res.send("This time zone has been deleted!");
      })
      .catch(async (error) => {
        await this.services.timeZone.commitChanges();
        setTimeout(() => {
          res.status(error?.status ?? 500).send(error?.message);
        }, 300);
      });
  }
}
