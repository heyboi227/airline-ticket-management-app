import { Request, Response } from "express";
import BaseController from "../../common/BaseController";
import {
  AddFlightLegValidator,
  IAddFlightLegDto,
} from "./dto/IAddFlightLeg.dto";
import { mkdirSync, readFileSync, unlinkSync } from "fs";
import { UploadedFile } from "express-fileupload";
import filetype from "magic-bytes.js";
import { extname, basename, dirname } from "path";
import sizeOf from "image-size";
import * as uuid from "uuid";
import PhotoModel from "../photo/PhotoModel.model";
import IConfig, { IResize } from "../../common/IConfig.interface";
import { DevConfig } from "../../configs";
import * as sharp from "sharp";
import FlightModel from "../flight/FlightModel.model";
import FlightLegModel from "./FlightLegModel.model";
import {
  EditFlightLegValidator,
  IEditFlightLegDto,
} from "./dto/IEditFlightLeg.dto";
import { DefaultFlightLegAdapterOptions } from "./FlightLegService.service";

export default class FlightLegController extends BaseController {
  async getAllFlightLegsByFlightId(req: Request, res: Response) {
    const flightId: number = +req.params?.fid;

    this.services.flight
      .getById(flightId, {})
      .then((result) => {
        if (result === null) {
          return res.status(404).send("Flight not found!");
        }

        this.services.flightLeg
          .getAllByFlightId(flightId, DefaultFlightLegAdapterOptions)
          .then((result) => {
            res.send(result);
          })
          .catch((error) => {
            res.status(500).send(error?.message);
          });
      })
      .catch((error) => {
        res.status(500).send(error?.message);
      });
  }

  async getFlightLegById(req: Request, res: Response) {
    const flightId: number = +req.params?.fid;
    const flightLegId: number = +req.params?.flid;

    this.services.flight
      .getById(flightId, {})
      .then((result) => {
        if (result === null) {
          return res.status(404).send("Flight not found!");
        }

        this.services.flightLeg
          .getById(flightLegId, DefaultFlightLegAdapterOptions)
          .then((result) => {
            if (result === null) {
              return res.status(404).send("Flight leg not found!");
            }

            res.send(result);
          })
          .catch((error) => {
            res.status(500).send(error?.message);
          });
      })
      .catch((error) => {
        res.status(500).send(error?.message);
      });
  }

  async add(req: Request, res: Response) {
    const flightId: number = +req.params?.fid;
    const data = req.body as IAddFlightLegDto;

    if (!AddFlightLegValidator(data)) {
      return res.status(400).send(AddFlightLegValidator.errors);
    }

    this.services.flight
      .getById(flightId, {})
      .then((resultFlight) => {
        if (resultFlight === null) {
          throw {
            status: 404,
            message: "Flight not found!",
          };
        }

        return resultFlight;
      })
      .then((resultFlight) => {
        const availableIngredientIds: number[] = resultFlight.ingredients?.map(
          (ingredient) => ingredient.ingredientId
        );

        for (let givenIngredientId of data.ingredientIds) {
          if (!availableIngredientIds.includes(givenIngredientId)) {
            throw {
              status: 404,
              message: `Ingredient ${givenIngredientId} not found in this flight!`,
            };
          }
        }

        return this.services.size.getAll({});
      })
      .then((sizes) => {
        const availableSizeIds: number[] = sizes.map((size) => size.sizeId);

        for (let givenSizeInformation of data.sizes) {
          if (!availableSizeIds.includes(givenSizeInformation.sizeId)) {
            throw {
              status: 404,
              message: `Size with ID ${givenSizeInformation.sizeId} not found!`,
            };
          }
        }
      })
      .then(() => {
        return this.services.flightLeg.startTransaction();
      })
      .then(() => {
        return this.services.flightLeg.add({
          name: data.name,
          flight_id: flightId,
          description: data.description,
        });
      })
      .then((newFlightLeg) => {
        for (let givenIngredientId of data.ingredientIds) {
          this.services.flightLeg
            .addFlightLegIngredient({
              flightLeg_id: newFlightLeg.flightLegId,
              ingredient_id: givenIngredientId,
            })
            .catch((error) => {
              throw {
                status: 500,
                message: error?.message,
              };
            });
        }

        return newFlightLeg;
      })
      .then((newFlightLeg) => {
        for (let givenSizeInformation of data.sizes) {
          this.services.flightLeg
            .addFlightLegSize({
              flightLeg_id: newFlightLeg.flightLegId,
              size_id: givenSizeInformation.sizeId,
              price: givenSizeInformation.price,
              kcal: givenSizeInformation.kcal,
              is_active: 1,
            })
            .catch((error) => {
              throw {
                status: 500,
                message: error?.message,
              };
            });
        }

        return newFlightLeg;
      })
      .then((newFlightLeg) => {
        return this.services.flightLeg.getById(newFlightLeg.flightLegId, {
          loadFlight: true,
          loadIngredients: true,
          loadSizes: true,
          hideInactiveSizes: true,
          loadPhotos: false,
        });
      })
      .then(async (result) => {
        await this.services.flightLeg.commitChanges();
        res.send(result);
      })
      .catch(async (error) => {
        await this.services.flightLeg.rollbackChanges();
        res.status(error?.status ?? 500).send(error?.message);
      });
  }

  async uploadPhoto(req: Request, res: Response) {
    const flightId: number = +req.params?.cid;
    const flightLegId: number = +req.params?.iid;

    this.services.flight
      .getById(flightId, { loadIngredients: false })
      .then((result) => {
        if (result === null)
          throw {
            code: 400,
            message: "Flight not found!",
          };

        return result;
      })
      .then(() => {
        return this.services.flightLeg.getById(flightLegId, {
          loadFlight: false,
          loadIngredients: false,
          loadSizes: false,
          hideInactiveSizes: true,
          loadPhotos: false,
        });
      })
      .then((result) => {
        if (result === null)
          throw {
            code: 404,
            message: "FlightLeg not found!",
          };

        if (result.flightId !== flightId)
          throw {
            code: 404,
            message: "FlightLeg not found in this flight!",
          };

        return this.doFileUpload(req);
      })
      .then(async (uploadedFiles) => {
        const photos: PhotoModel[] = [];

        for (let singleFile of await uploadedFiles) {
          const filename = basename(singleFile);

          const photo = await this.services.photo.add({
            name: filename,
            file_path: singleFile,
            flightLeg_id: flightLegId,
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

  async edit(req: Request, res: Response) {
    const flightId: number = +req.params?.cid;

    const data = req.body as IEditFlightLegDto;

    if (!EditFlightLegValidator(data)) {
      return res.status(400).send(EditFlightLegValidator.errors);
    }

    this.services.flight
      .getById(flightId, { loadIngredients: true })
      .then((result) => {
        if (result === null) {
          throw {
            status: 404,
            message: "Flight not found!",
          };
        }

        return result as FlightModel;
      })
      .then(async (flight) => {
        const flightLegId: number = +req.params?.iid;

        return this.retrieveFlightLeg(flight, flightLegId);
      })
      .then(this.checkFlightLeg)
      .then(async (result) => {
        await this.services.flightLeg.startTransaction();
        return result;
      })
      .then(async (result) => {
        const currentIngredientIds = result.flightLeg.ingredients?.map(
          (ingredient) => ingredient.ingredientId
        );
        const newIngredientIds = data.ingredientIds;

        const availableIngredientIds = result.flight.ingredients?.map(
          (i) => i.ingredientId
        );

        for (let id of data.ingredientIds) {
          if (!availableIngredientIds.includes(id)) {
            throw {
              status: 400,
              message:
                "Ingredient " +
                id +
                " is not available for flightLegs in this flight!",
            };
          }
        }

        const ingredientIdsToAdd = newIngredientIds.filter(
          (id) => !currentIngredientIds.includes(id)
        );
        for (let id of ingredientIdsToAdd) {
          if (
            !(await this.services.flightLeg.addFlightLegIngredient({
              flightLeg_id: result.flightLeg.flightLegId,
              ingredient_id: id,
            }))
          ) {
            throw {
              status: 500,
              message: "Error adding a new ingredient to this flightLeg!",
            };
          }
        }

        const ingredientIdsToDelete = currentIngredientIds.filter(
          (id) => !newIngredientIds.includes(id)
        );
        for (let id of ingredientIdsToDelete) {
          if (
            !(await this.services.flightLeg.deleteFlightLegIngredient({
              flightLeg_id: result.flightLeg.flightLegId,
              ingredient_id: id,
            }))
          ) {
            throw {
              status: 500,
              message:
                "Error delete an existing ingredient from this flightLeg!",
            };
          }
        }

        return result;
      })
      .then(async (result) => {
        const currentSizeIds = result.flightLeg.sizes?.map(
          (sizeInfo) => sizeInfo.size.sizeId
        );
        const currentVisibleSizeIds = result.flightLeg.sizes
          ?.filter((sizeInfo) => sizeInfo.isActive)
          .map((sizeInfo) => sizeInfo.size.sizeId);
        const currentInvisibleSizeIds = result.flightLeg.sizes
          ?.filter((sizeInfo) => !sizeInfo.isActive)
          .map((sizeInfo) => sizeInfo.size.sizeId);

        const newSizeIds = data.sizes?.map((size) => size.sizeId);

        const sizeIdsToHide = currentVisibleSizeIds.filter(
          (id) => !newSizeIds.includes(id)
        );
        const sizeIdsToShow = currentInvisibleSizeIds.filter((id) =>
          newSizeIds.includes(id)
        );
        const sizeIdsToAdd = newSizeIds.filter(
          (id) => !currentSizeIds.includes(id)
        );
        const sizeIdsUnion = [...new Set([...newSizeIds, ...sizeIdsToShow])];
        const sizeIdsToEdit = sizeIdsUnion.filter(
          (id) => !sizeIdsToAdd.includes(id)
        );

        for (let id of sizeIdsToHide) {
          await this.services.size.hideFlightLegSize(
            result.flightLeg.flightLegId,
            id
          );
        }

        for (let id of sizeIdsToShow) {
          await this.services.size.showFlightLegSize(
            result.flightLeg.flightLegId,
            id
          );
        }

        for (let id of sizeIdsToAdd) {
          const size = data.sizes?.find((size) => size.sizeId === id);

          if (!size) continue;

          await this.services.flightLeg.addFlightLegSize({
            flightLeg_id: result.flightLeg.flightLegId,
            size_id: id,
            price: size.price,
            kcal: size.kcal,
            is_active: 1,
          });
        }

        for (let id of sizeIdsToEdit) {
          const size = data.sizes?.find((size) => size.sizeId === id);

          if (!size) continue;

          await this.services.flightLeg.editFlightLegSize({
            flightLeg_id: result.flightLeg.flightLegId,
            size_id: id,
            price: size.price,
            kcal: size.kcal,
          });
        }

        await this.services.flightLeg.edit(
          result.flightLeg.flightLegId,
          {
            name: data.name,
            description: data.description,
            is_active: data.isActive ? 1 : 0,
          },
          {
            loadFlight: false,
            loadIngredients: false,
            loadSizes: false,
            hideInactiveSizes: false,
            loadPhotos: false,
          }
        );

        return result;
      })
      .then(async (result) => {
        await this.services.flightLeg.commitChanges();

        res.send(
          await this.services.flightLeg.getById(result.flightLeg.flightLegId, {
            loadFlight: true,
            loadIngredients: true,
            loadSizes: true,
            hideInactiveSizes: true,
            loadPhotos: true,
          })
        );
      })
      .catch(async (error) => {
        await this.services.flightLeg.rollbackChanges();

        res.status(error?.status ?? 500).send(error?.message);
      });
  }

  private async retrieveFlightLeg(
    flight: FlightModel,
    flightLegId: number
  ): Promise<{ flight: FlightModel; flightLeg: FlightLegModel | null }> {
    return {
      flight: flight,
      flightLeg: await this.services.flightLeg.getById(flightLegId, {
        loadFlight: false,
        loadIngredients: true,
        loadSizes: true,
        hideInactiveSizes: false,
        loadPhotos: false,
      }),
    };
  }

  private checkFlightLeg(result: {
    flight: FlightModel;
    flightLeg: FlightLegModel | null;
  }): { flight: FlightModel; flightLeg: FlightLegModel } {
    if (result.flightLeg === null) {
      throw {
        status: 404,
        message: "FlightLeg not found!",
      };
    }

    if (result.flightLeg.flightId !== result.flight.flightId) {
      throw {
        status: 404,
        message: "FlightLeg not found in this flight!",
      };
    }

    return result;
  }

  async deletePhoto(req: Request, res: Response) {
    const flightId: number = +req.params?.cid;
    const flightLegId: number = +req.params?.iid;
    const photoId: number = +req.params?.pid;

    this.services.flight
      .getById(flightId, DefaultFlightAdapterOptions)
      .then((result) => {
        if (result === null)
          throw { status: 404, message: "Flight not found!" };
        return result;
      })
      .then(async (flight) => {
        return {
          flight: flight,
          flightLeg: await this.services.flightLeg.getById(flightLegId, {
            loadPhotos: true,
            hideInactiveSizes: false,
            loadFlight: false,
            loadIngredients: false,
            loadSizes: false,
          }),
        };
      })
      .then(({ flight, flightLeg }) => {
        if (flightLeg === null)
          throw { status: 404, message: "FlightLeg not found!" };
        if (flightLeg.flightId !== flight.flightId)
          throw { status: 404, message: "FlightLeg not found in this flight!" };
        return flightLeg;
      })
      .then((flightLeg) => {
        const photo = flightLeg.photos?.find(
          (photo) => photo.photoId === photoId
        );
        if (!photo)
          throw { status: 404, message: "Photo not found in this flightLeg!" };
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

  async delete(req: Request, res: Response) {
    const flightId: number = +req.params?.cid;
    const flightLegId: number = +req.params?.iid;

    this.services.flight
      .getById(flightId, DefaultFlightAdapterOptions)
      .then((result) => {
        if (result === null)
          throw { status: 404, message: "Flight not found!" };
        return result;
      })
      .then(async (flight) => {
        return {
          flight: flight,
          flightLeg: await this.services.flightLeg.getById(
            flightLegId,
            DefaultFlightLegAdapterOptions
          ),
        };
      })
      .then(({ flight, flightLeg }) => {
        if (flightLeg === null)
          throw { status: 404, message: "FlightLeg not found!" };
        if (flightLeg.flightId !== flight.flightId)
          throw { status: 404, message: "FlightLeg not found in this flight!" };
        return flightLeg;
      })
      .then((flightLeg) => {
        return this.services.flightLeg.deleteById(flightLeg.flightLegId);
      })
      .then((result) => {
        for (let filePath of result.filesToDelete) {
          const directoryPart = dirname(filePath);
          const fileName = basename(filePath);

          for (let resize of DevConfig.fileUploads.photos.resize) {
            const filePath = directoryPart + "/" + resize.prefix + fileName;
            unlinkSync(filePath);
          }

          unlinkSync(filePath);
        }
      })
      .then(() => {
        res.send("Deleted!");
      })
      .catch((error) => {
        res
          .status(error?.status ?? 500)
          .send(error?.message ?? "Server side error!");
      });
  }
}
