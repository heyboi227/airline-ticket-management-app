import BaseController from "../../common/BaseController";
import { Request, Response } from "express";
import { AddAirportValidator, IAddAirportDto } from "./dto/IAddAirport.dto";
import {
  EditAirportValidator,
  IEditAirport,
  IEditAirportDto,
} from "./dto/IEditAirport.dto";
import { DefaultAirportAdapterOptions } from "./AirportService.service";
import StatusError from "../../common/StatusError";
import escapeHTML = require("escape-html");

export default class AirportController extends BaseController {
  getAll(_req: Request, res: Response) {
    this.services.airport
      .getAll(DefaultAirportAdapterOptions)
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
    const airportId: number = +req.params?.aid;

    this.services.airport
      .getById(airportId, DefaultAirportAdapterOptions)
      .then((result) => {
        if (result === null) {
          throw new StatusError(404, "The airport is not found!");
        }

        res.send(result);
      })
      .catch((error) => {
        setTimeout(() => {
          res.status(error?.status ?? 500).send(error?.message);
        }, 500);
      });
  }

  getByAirportCode(req: Request, res: Response) {
    const airportCode: string = req.params?.acode;

    this.services.airport
      .getByAirportCode(airportCode)
      .then((result) => {
        if (result === null) {
          throw new StatusError(404, "The airport is not found!");
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

    this.services.airport
      .getByName(name)
      .then((result) => {
        if (result === null) {
          throw new StatusError(404, "The airport is not found!");
        }

        res.send(result);
      })
      .catch((error) => {
        setTimeout(() => {
          res.status(error?.status ?? 500).send(error?.message);
        }, 500);
      });
  }

  getAllByCity(req: Request, res: Response) {
    const city: string = req.params?.acity;

    this.services.airport
      .getAllByCity(city)
      .then((result) => {
        if (result === null) {
          throw new StatusError(404, "The airports are not found!");
        }

        res.send(result);
      })
      .catch((error) => {
        setTimeout(() => {
          res.status(error?.status ?? 500).send(error?.message);
        }, 500);
      });
  }

  getAllByCountryId(req: Request, res: Response) {
    const countryId: number = +req.params?.cid;

    this.services.airport
      .getAllByCountryId(countryId)
      .then((result) => {
        if (result === null) {
          throw new StatusError(404, "The airports are not found!");
        }

        res.send(result);
      })
      .catch((error) => {
        setTimeout(() => {
          res.status(error?.status ?? 500).send(error?.message);
        }, 500);
      });
  }

  getAllBySearchString(req: Request, res: Response) {
    const searchString: string = req.params?.sstring;

    this.services.airport
      .getAllBySearchString(searchString)
      .then((result) => {
        res.send(result);
      })
      .catch((error) => {
        res.status(500).send(error?.message);
      });
  }

  add(req: Request, res: Response) {
    const body = req.body as IAddAirportDto;

    if (!AddAirportValidator(body)) {
      const safeOutput = escapeHTML(JSON.stringify(AddAirportValidator.errors));
      return res.status(400).send(safeOutput);
    }

    this.services.country
      .getById(body.countryId, DefaultAirportAdapterOptions)
      .then((resultCountry) => {
        if (resultCountry === null) {
          throw new StatusError(404, "The country is not found!");
        }

        return this.services.airport.startTransaction();
      })
      .then(() => {
        return this.services.airport.add({
          airport_code: body.airportCode,
          airport_name: body.airportName,
          city: body.city,
          country_id: body.countryId,
          time_zone_id: body.timeZoneId,
        });
      })
      .then((newAirport) => {
        return this.services.airport.getById(
          newAirport.airportId,
          DefaultAirportAdapterOptions
        );
      })
      .then(async (result) => {
        await this.services.airport.commitChanges();
        res.send(result);
      })
      .catch(async (error) => {
        await this.services.airport.rollbackChanges();
        const safeOutput = escapeHTML(error?.message);
        res.status(error?.status ?? 500).send(safeOutput);
      });
  }

  editById(req: Request, res: Response) {
    const airportId: number = +req.params?.aid;
    const data = req.body as IEditAirportDto;

    if (!EditAirportValidator(data)) {
      const safeOutput = escapeHTML(
        JSON.stringify(EditAirportValidator.errors)
      );
      return res.status(400).send(safeOutput);
    }

    const serviceData: IEditAirport = {};

    if (data.airportCode !== undefined) {
      serviceData.airport_code = data.airportCode;
    }

    if (data.city !== undefined) {
      serviceData.city = data.city;
    }

    if (data.airportName !== undefined) {
      serviceData.name = data.airportName;
    }

    if (data.countryId !== undefined) {
      serviceData.country_id = data.countryId;
    }

    if (data.timeZoneId !== undefined) {
      serviceData.time_zone_id = data.timeZoneId;
    }

    this.services.airport
      .startTransaction()
      .then(() => {
        return this.services.airport.editById(airportId, serviceData);
      })
      .then(async (result) => {
        await this.services.airport.commitChanges();
        res.send(result);
      })
      .catch(async (error) => {
        await this.services.airport.rollbackChanges();
        setTimeout(() => {
          res.status(500).send(error?.message);
        }, 500);
      });
  }

  deleteById(req: Request, res: Response) {
    const airportId: number = +req.params?.aid;

    this.services.airport
      .startTransaction()
      .then(() => {
        return this.services.airport.getById(
          airportId,
          DefaultAirportAdapterOptions
        );
      })
      .then((result) => {
        if (result === null) {
          throw new StatusError(404, "The airport is not found!");
        }
      })
      .then(async () => {
        await this.services.airport.commitChanges();
        return this.services.airport.deleteById(airportId);
      })
      .then(() => {
        res.send("This airport has been deleted!");
      })
      .catch(async (error) => {
        await this.services.airport.rollbackChanges();
        setTimeout(() => {
          res.status(error?.status ?? 500).send(error?.message);
        }, 500);
      });
  }
}
