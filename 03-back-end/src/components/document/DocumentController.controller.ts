import BaseController from "../../common/BaseController";
import { Request, Response } from "express";
import { AddDocumentValidator, IAddDocumentDto } from "./dto/IAddDocument.dto";
import { DefaultDocumentAdapterOptions } from "./DocumentService.service";
import {
  EditDocumentValidator,
  IEditDocumentDto,
} from "./dto/IEditDocument.dto";

export default class DocumentController extends BaseController {
  getById(req: Request, res: Response) {
    const documentId: number = +req.params?.did;

    this.services.document
      .getById(documentId, DefaultDocumentAdapterOptions)
      .then((result) => {
        if (req.authorization?.role === "user") {
          if (req.authorization?.id !== result.userId) {
            throw {
              status: 403,
              message: "You do not have access to this resource!",
            };
          }
        }

        if (result === null) {
          throw {
            status: 404,
            message: "The document is not found!",
          };
        }

        res.send(result);
      })
      .catch((error) => {
        setTimeout(() => {
          res.status(error?.status ?? 500).send(error?.message);
        }, 300);
      });
  }

  getByDocumentNumber(req: Request, res: Response) {
    const documentNumber: string = req.params?.dnum;

    this.services.document
      .getByDocumentNumber(documentNumber)
      .then((result) => {
        if (req.authorization?.role === "user") {
          if (req.authorization?.id !== result.userId) {
            throw {
              status: 403,
              message: "You do not have access to this resource!",
            };
          }
        }

        if (result === null) {
          throw {
            status: 404,
            message: "The document is not found!",
          };
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
    const body = req.body as IAddDocumentDto;

    if (!AddDocumentValidator(body)) {
      return res.status(400).send(AddDocumentValidator.errors);
    }

    this.services.document
      .startTransaction()
      .then(() => {
        return this.services.document.add({
          country_id: body.countryId,
          document_number: body.documentNumber,
          type: body.type,
          user_id: body.userId,
        });
      })
      .then(async (result) => {
        await this.services.document.commitChanges();
        res.send(result);
      })
      .catch(async (error) => {
        await this.services.document.rollbackChanges();
        setTimeout(() => {
          res.status(500).send(error?.message);
        }, 300);
      });
  }

  editById(req: Request, res: Response) {
    const documentId: number = +req.params?.did;
    const data = req.body as IEditDocumentDto;

    if (!EditDocumentValidator(data)) {
      return res.status(400).send(EditDocumentValidator.errors);
    }

    this.services.document
      .startTransaction()
      .then(() => {
        return this.services.document.editById(documentId, {
          country_id: data.countryId,
          type: data.type,
          document_number: data.documentNumber,
          user_id: data.userId,
        });
      })
      .then(async (result) => {
        await this.services.document.commitChanges();
        res.send(result);
      })
      .catch(async (error) => {
        await this.services.document.rollbackChanges();
        setTimeout(() => {
          res.status(500).send(error?.message);
        }, 300);
      });
  }

  deleteById(req: Request, res: Response) {
    const documentId: number = +req.params?.did;

    this.services.document
      .startTransaction()
      .then(() => {
        return this.services.document.getById(documentId, {
          showCountry: false,
          showUser: false,
        });
      })
      .then((result) => {
        if (result === null) {
          throw {
            status: 404,
            message: "The document is not found!",
          };
        }
      })
      .then(async () => {
        await this.services.document.commitChanges();
        return this.services.document.deleteById(documentId);
      })
      .then(() => {
        res.send("This document has been deleted!");
      })
      .catch(async (error) => {
        await this.services.document.commitChanges();
        setTimeout(() => {
          res.status(error?.status ?? 500).send(error?.message);
        }, 300);
      });
  }
}
