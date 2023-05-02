import { Request, Response } from "express";
import BaseController from "../../common/BaseController";
import {
  AddAdministratorValidator,
  IAddAdministratorDto,
} from "./dto/IAddAdministrator.dto";
import * as bcrypt from "bcrypt";
import { DefaultAdministratorAdapterOptions } from "./AdministratorService.service";
import StatusError from "../../common/StatusError";
import IEditAdministrator, {
  EditAdministratorValidator,
  IEditAdministratorDto,
} from "./dto/IEditAdministrator.dto";

export default class AdministratorController extends BaseController {
  getAll(_req: Request, res: Response) {
    this.services.administrator
      .getAll({
        removePassword: true,
      })
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
    const administratorId: number = +req.params?.aid;

    this.services.administrator
      .getById(administratorId, {
        removePassword: true,
      })
      .then((result) => {
        if (result === null) {
          throw new StatusError(404, "The administrator is not found!");
        }

        res.send(result);
      })
      .catch((error) => {
        setTimeout(() => {
          res.status(error?.status ?? 500).send(error?.message);
        }, 500);
      });
  }

  getByUsername(req: Request, res: Response) {
    const username: string = req.params?.ausername;

    this.services.administrator
      .getByUsername(username, {
        removePassword: true,
      })
      .then((result) => {
        if (result === null) {
          throw new StatusError(404, "The administrator is not found!");
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
    const body = req.body as IAddAdministratorDto;

    if (!AddAdministratorValidator(body)) {
      return res.status(400).send(AddAdministratorValidator.errors);
    }

    const passwordHash = bcrypt.hashSync(body.password, 10);

    this.services.administrator
      .startTransaction()
      .then(() => {
        return this.services.administrator.add({
          username: body.username,
          password_hash: passwordHash,
        });
      })
      .then(async (result) => {
        await this.services.administrator.commitChanges();
        res.send(result);
      })
      .catch(async (error) => {
        await this.services.administrator.rollbackChanges();
        setTimeout(() => {
          res.status(500).send(error?.message);
        }, 500);
      });
  }

  editById(req: Request, res: Response) {
    const administratorId: number = +req.params?.aid;
    const data = req.body as IEditAdministratorDto;

    if (!EditAdministratorValidator(data)) {
      return res.status(400).send(EditAdministratorValidator.errors);
    }

    const serviceData: IEditAdministrator = {};

    if (data.password !== undefined) {
      const passwordHash = bcrypt.hashSync(data.password, 10);
      serviceData.password_hash = passwordHash;
    }

    if (data.isActive !== undefined) {
      serviceData.is_active = data.isActive ? 1 : 0;
    }

    this.services.administrator
      .startTransaction()
      .then(() => {
        return this.services.administrator.editById(
          administratorId,
          serviceData,
          DefaultAdministratorAdapterOptions
        );
      })
      .then(async (result) => {
        await this.services.administrator.commitChanges();
        res.send(result);
      })
      .catch(async (error) => {
        await this.services.administrator.rollbackChanges();
        setTimeout(() => {
          res.status(500).send(error?.message);
        }, 500);
      });
  }
}
