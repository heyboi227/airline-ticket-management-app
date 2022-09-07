import { Request, Response } from "express";
import BaseController from "../../common/BaseController";
import {
  AddAdministratorValidator,
  IAddAdministratorDto,
} from "./dto/IAddAdministrator.dto";
import * as bcrypt from "bcrypt";
import IEditAdministrator, {
  EditAdministratorValidator,
  IEditAdministratorDto,
} from "./dto/IEditAdministrator.dto";

export default class AdministratorController extends BaseController {
  getAll(_req: Request, res: Response) {
    this.services.administrator
      .startTransaction()
      .then(() => {
        return this.services.administrator.getAll({
          removePassword: true,
        });
      })
      .then(async (result) => {
        await this.services.administrator.commitChanges();
        res.send(result);
      })
      .catch(async (error) => {
        await this.services.administrator.rollbackChanges();
        res.status(500).send(error?.message);
      });
  }

  getById(req: Request, res: Response) {
    const id: number = +req.params?.aid;

    this.services.administrator
      .startTransaction()
      .then(() => {
        return this.services.administrator.getById(id, {
          removePassword: true,
        });
      })
      .then(async (result) => {
        if (result === null) {
          res.status(404).send("Administrator not found!");
        }

        await this.services.administrator.commitChanges();
        res.send(result);
      })
      .catch(async (error) => {
        await this.services.administrator.rollbackChanges();
        setTimeout(() => {
          res.status(500).send(error?.message);
        }, 300);
      });
  }

  getByUsername(req: Request, res: Response) {
    const username: string = req.params?.ausername;

    this.services.administrator
      .startTransaction()
      .then(() => {
        return this.services.administrator.getByUsername(username, {
          removePassword: true,
        });
      })
      .then(async (result) => {
        if (result === null) {
          res.status(404).send("Administrator not found!");
        }

        await this.services.administrator.commitChanges();
        res.send(result);
      })
      .catch(async (error) => {
        await this.services.administrator.rollbackChanges();
        setTimeout(() => {
          res.status(500).send(error?.message);
        }, 300);
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
        res.status(500).send(error?.message);
      });
  }

  editById(req: Request, res: Response) {
    const id: number = +req.params?.aid;
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
        return this.services.administrator.editById(id, serviceData);
      })
      .then(async (result) => {
        await this.services.administrator.commitChanges();
        res.send(result);
      })
      .catch(async (error) => {
        await this.services.administrator.rollbackChanges();
        res.status(500).send(error?.message);
      });
  }
}
