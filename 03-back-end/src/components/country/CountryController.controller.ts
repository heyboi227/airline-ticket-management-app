import BaseController from "../../common/BaseController";
import { Request, Response } from "express";
import { AddCountryValidator, IAddCountryDto } from "./dto/IAddCountry.dto";
import { EditCountryValidator, IEditCountryDto } from "./dto/IEditCountry.dto";

export default class CountryController extends BaseController {
  getAll(req: Request, res: Response) {
    this.services.country
      .getAll({})
      .then((result) => {
        res.send(result);
      })
      .catch((error) => {
        res.status(500).send(error?.message);
      });
  }

  getById(req: Request, res: Response) {
    const countryId: number = +req.params?.cid;

    this.services.country
      .getById(countryId, {})
      .then((result) => {
        if (result === null) {
          res.status(404).send("The country is not found!");
        }

        res.send(result);
      })
      .catch((error) => {
        res.status(500).send(error?.message);
      });
  }

  getByName(req: Request, res: Response) {
    const name: string = req.params?.cname;

    this.services.country
      .getCountryByName(name, {})
      .then((result) => {
        if (result === null) {
          res.status(404).send("The country is not found!");
        }

        res.send(result);
      })
      .catch((error) => {
        res.status(500).send(error?.message);
      });
  }

  add(req: Request, res: Response) {
    const body = req.body as IAddCountryDto;

    if (!AddCountryValidator(body)) {
      return res.status(400).send(AddCountryValidator.errors);
    }

    this.services.country
      .add({
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
    const countryId: number = +req.params?.cid;
    const data = req.body as IEditCountryDto;

    if (!EditCountryValidator(data)) {
      return res.status(400).send(EditCountryValidator.errors);
    }

    this.services.country
      .editById(countryId, { name: data.name }, {})
      .then((result) => {
        res.send(result);
      })
      .catch((error) => {
        res.status(500).send(error?.message);
      });
  }

  deleteById(req: Request, res: Response) {
    const countryId: number = +req.params?.cid;

    this.services.country
      .getById(countryId, {})
      .then((result) => {
        if (result === null) {
          throw {
            status: 404,
            message: "The country is not found!",
          };
        }
      })
      .then(() => {
        return this.services.country.deleteById(countryId);
      })
      .then(() => {
        res.send("This country has been deleted!");
      })
      .catch((error) => {
        res.status(error?.status ?? 500).send(error?.message);
      });
  }
}
