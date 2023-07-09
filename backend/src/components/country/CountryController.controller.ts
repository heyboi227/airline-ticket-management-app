import BaseController from "../../common/BaseController";
import { Request, Response } from "express";
import { AddCountryValidator, AddCountryDto } from "./dto/AddCountry.dto";
import { EditCountryValidator, EditCountryDto } from "./dto/EditCountry.dto";
import StatusError from "../../common/StatusError";
import escapeHTML = require("escape-html");

export default class CountryController extends BaseController {
  getAll(_req: Request, res: Response) {
    this.services.country
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
    const countryId: number = +req.params?.cid;

    this.services.country
      .getById(countryId, {})
      .then((result) => {
        if (result === null) {
          throw new StatusError(404, "The country is not found!");
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
    const name: string = req.params?.cname;

    this.services.country
      .getByName(name)
      .then((result) => {
        if (result === null) {
          throw new StatusError(404, "The country is not found!");
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
    const body = req.body as AddCountryDto;

    if (!AddCountryValidator(body)) {
      const safeOutput = escapeHTML(JSON.stringify(AddCountryValidator.errors));
      return res.status(400).send(safeOutput);
    }

    this.services.country
      .startTransaction()
      .then(() => {
        return this.services.country.add({
          country_name: body.countryName,
        });
      })
      .then(async (result) => {
        await this.services.country.commitChanges();
        res.send(result);
      })
      .catch(async (error) => {
        await this.services.country.rollbackChanges();
        setTimeout(() => {
          res.status(500).send(error?.message);
        }, 300);
      });
  }

  editById(req: Request, res: Response) {
    const countryId: number = +req.params?.cid;
    const data = req.body as EditCountryDto;

    if (!EditCountryValidator(data)) {
      const safeOutput = escapeHTML(
        JSON.stringify(EditCountryValidator.errors)
      );
      return res.status(400).send(safeOutput);
    }

    this.services.country
      .startTransaction()
      .then(() => {
        return this.services.country.editById(countryId, {
          country_name: data.countryName,
        });
      })
      .then(async (result) => {
        await this.services.country.commitChanges();
        res.send(result);
      })
      .catch(async (error) => {
        await this.services.country.rollbackChanges();
        setTimeout(() => {
          res.status(500).send(error?.message);
        }, 300);
      });
  }

  deleteById(req: Request, res: Response) {
    const countryId: number = +req.params?.cid;

    this.services.country
      .startTransaction()
      .then(() => {
        return this.services.country.getById(countryId, {});
      })
      .then((result) => {
        if (result === null) {
          throw new StatusError(404, "The country is not found!");
        }
      })
      .then(async () => {
        await this.services.country.commitChanges();
        return this.services.country.deleteById(countryId);
      })
      .then(() => {
        res.send("This country has been deleted!");
      })
      .catch(async (error) => {
        await this.services.country.commitChanges();
        setTimeout(() => {
          res.status(error?.status ?? 500).send(error?.message);
        }, 300);
      });
  }
}
