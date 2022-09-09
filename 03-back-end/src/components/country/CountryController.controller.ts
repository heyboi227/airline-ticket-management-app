import BaseController from "../../common/BaseController";
import { Request, Response } from "express";
import { AddCountryValidator, IAddCountryDto } from "./dto/IAddCountry.dto";
import { EditCountryValidator, IEditCountryDto } from "./dto/IEditCountry.dto";

export default class CountryController extends BaseController {
  getAll(_req: Request, res: Response) {
    this.services.country
      .startTransaction()
      .then(() => {
        return this.services.country.getAll({});
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

  getById(req: Request, res: Response) {
    const countryId: number = +req.params?.cid;

    this.services.country
      .startTransaction()
      .then(() => {
        return this.services.country.getById(countryId, {});
      })
      .then(async (result) => {
        if (result === null) {
          throw {
            status: 404,
            message: "The country is not found!",
          };
        }

        await this.services.country.commitChanges();
        res.send(result);
      })
      .catch(async (error) => {
        await this.services.country.rollbackChanges();
        setTimeout(() => {
          res.status(error?.status ?? 500).send(error?.message);
        }, 300);
      });
  }

  getByName(req: Request, res: Response) {
    const name: string = req.params?.cname;

    this.services.country
      .startTransaction()
      .then(() => {
        return this.services.country.getByName(name);
      })
      .then(async (result) => {
        if (result === null) {
          throw {
            status: 404,
            message: "The country is not found!",
          };
        }

        await this.services.country.commitChanges();
        res.send(result);
      })
      .catch(async (error) => {
        await this.services.country.rollbackChanges();
        setTimeout(() => {
          res.status(error?.status ?? 500).send(error?.message);
        }, 300);
      });
  }

  add(req: Request, res: Response) {
    const body = req.body as IAddCountryDto;

    if (!AddCountryValidator(body)) {
      return res.status(400).send(AddCountryValidator.errors);
    }

    this.services.country
      .startTransaction()
      .then(() => {
        return this.services.country.add({
          name: body.name,
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
    const data = req.body as IEditCountryDto;

    if (!EditCountryValidator(data)) {
      return res.status(400).send(EditCountryValidator.errors);
    }

    this.services.country
      .startTransaction()
      .then(() => {
        return this.services.country.editById(countryId, {
          name: data.name,
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
          throw {
            status: 404,
            message: "The country is not found!",
          };
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
