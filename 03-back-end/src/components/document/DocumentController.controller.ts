import BaseController from "../../common/BaseController";
import { Request, Response } from "express";
import { AddDocumentValidator, IAddDocumentDto } from "./dto/IAddDocument.dto";
import { DefaultDocumentAdapterOptions } from "./DocumentService.service";
import PhotoModel from "../photo/PhotoModel.model";
import { basename, dirname, extname } from "path";
import { UploadedFile } from "express-fileupload";
import { mkdirSync, readFileSync, unlinkSync } from "fs";
import sharp = require("sharp");
import IConfig, { IResize } from "../../common/IConfig.interface";
import { DevConfig } from "../../configs";
import filetype from "magic-bytes.js";
import sizeOf from "image-size";
import * as uuid from "uuid";

export default class DocumentController extends BaseController {
  getAll(_req: Request, res: Response) {
    this.services.document
      .getAll(DefaultDocumentAdapterOptions)
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

  deleteById(req: Request, res: Response) {
    const documentId: number = +req.params?.did;

    this.services.document
      .startTransaction()
      .then(() => {
        return this.services.document.getById(
          documentId,
          DefaultDocumentAdapterOptions
        );
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

  uploadPhoto(req: Request, res: Response) {
    const documentId: number = +req.params?.did;

    this.services.document
      .getById(documentId, DefaultDocumentAdapterOptions)
      .then((result) => {
        if (result === null)
          throw {
            code: 404,
            message: "Document not found!",
          };

        return this.doFileUpload(req);
      })
      .then(async (uploadedFiles) => {
        const photos: PhotoModel[] = [];

        for (let singleFile of uploadedFiles) {
          const filename = basename(singleFile);

          const photo = await this.services.photo.add({
            name: filename,
            file_path: singleFile,
            document_id: documentId,
          });

          if (photo === null) {
            throw {
              code: 500,
              message: "Failed to add this photo into the database!",
            };
          }

          photos.push(photo);
        }

        res.send(photos);
      })
      .catch((error) => {
        res.status(error?.code).send(error?.message);
      });
  }

  private async doFileUpload(req: Request): Promise<string[] | null> {
    const config: IConfig = DevConfig;

    if (!req.files || Object.keys(req.files).length === 0)
      throw {
        code: 400,
        message: "No file were uploaded!",
      };

    const fileFieldNames = Object.keys(req.files);

    const now = new Date();
    const year = now.getFullYear();
    const month = (now.getMonth() + 1 + "").padStart(2, "0");

    const uploadDestinationRoot = config.server.static.path + "/";
    const destinationDirectory =
      config.fileUploads.destinationDirectoryRoot + year + "/" + month + "/";

    mkdirSync(uploadDestinationRoot + destinationDirectory, {
      recursive: true,
      mode: "755",
    });

    const uploadedFiles = [];

    for (let fileFieldName of fileFieldNames) {
      const file = req.files[fileFieldName] as UploadedFile;

      const type = filetype(readFileSync(file.tempFilePath))[0]?.typename;

      if (!config.fileUploads.photos.allowedTypes.includes(type)) {
        unlinkSync(file.tempFilePath);
        throw {
          code: 415,
          message: `File ${fileFieldName} - type is not supported!`,
        };
      }

      file.name = file.name.toLocaleLowerCase();

      const declaredExtension = extname(file.name);

      if (
        !config.fileUploads.photos.allowedExtensions.includes(declaredExtension)
      ) {
        unlinkSync(file.tempFilePath);
        throw {
          code: 415,
          message: `File ${fileFieldName} - extension is not supported!`,
        };
      }

      const size = sizeOf(file.tempFilePath);

      if (
        size.width < config.fileUploads.photos.width.min ||
        size.width > config.fileUploads.photos.width.max
      ) {
        unlinkSync(file.tempFilePath);
        throw {
          code: 415,
          message: `File ${fileFieldName} - image width is not supported!`,
        };
      }

      if (
        size.height < config.fileUploads.photos.height.min ||
        size.height > config.fileUploads.photos.height.max
      ) {
        unlinkSync(file.tempFilePath);
        throw {
          code: 415,
          message: `File ${fileFieldName} - image height is not supported!`,
        };
      }

      const fileNameRandomPart = uuid.v4();

      const fileDestinationPath =
        uploadDestinationRoot +
        destinationDirectory +
        fileNameRandomPart +
        "-" +
        file.name;

      file.mv(fileDestinationPath, async (error) => {
        if (error) {
          throw {
            code: 500,
            message: `File ${fileFieldName} - could not be saved on the server!`,
          };
        }

        for (let resizeOptions of config.fileUploads.photos.resize) {
          await this.createResizedPhotos(
            destinationDirectory,
            fileNameRandomPart + "-" + file.name,
            resizeOptions
          );
        }
      });

      uploadedFiles.push(
        destinationDirectory + fileNameRandomPart + "-" + file.name
      );
    }

    return uploadedFiles;
  }

  private async createResizedPhotos(
    directory: string,
    filename: string,
    resizeOptions: IResize
  ) {
    const config: IConfig = DevConfig;

    await sharp(config.server.static.path + "/" + directory + filename)
      .resize({
        width: resizeOptions.width,
        height: resizeOptions.height,
        fit: resizeOptions.fit,
        background: resizeOptions.defaultBackground,
        withoutEnlargement: true,
      })
      .toFile(
        config.server.static.path +
          "/" +
          directory +
          resizeOptions.prefix +
          filename
      );
  }

  deletePhoto(req: Request, res: Response) {
    const documentId: number = +req.params?.did;
    const photoId: number = +req.params?.pid;

    this.services.document
      .getById(documentId, DefaultDocumentAdapterOptions)
      .then((document) => {
        if (document === null)
          throw { status: 404, message: "Document not found!" };
        return document;
      })
      .then((document) => {
        const photo = document.photos?.find(
          (photo) => photo.photoId === photoId
        );
        if (!photo)
          throw { status: 404, message: "Photo not found in this document!" };
        return photo;
      })
      .then(async (photo) => {
        await this.services.photo.deleteById(photo.photoId);
        return photo;
      })
      .then((photo) => {
        const directoryPart =
          DevConfig.server.static.path + "/" + dirname(photo.filePath);
        const fileName = basename(photo.filePath);

        for (let resize of DevConfig.fileUploads.photos.resize) {
          const filePath = directoryPart + "/" + resize.prefix + fileName;
          unlinkSync(filePath);
        }

        unlinkSync(DevConfig.server.static.path + "/" + photo.filePath);

        res.send("Deleted!");
      })
      .catch((error) => {
        res
          .status(error?.status ?? 500)
          .send(error?.message ?? "Server side error!");
      });
  }
}
