import BaseService from "../../common/BaseService";
import IAdapterOptions from "../../common/IAdapterOptions.interface";
import IAddPhoto from "./dto/IAddPhoto.dto";
import PhotoModel from "./PhotoModel.model";

export interface IPhotoAdapterOptions extends IAdapterOptions {}

export default class PhotoService extends BaseService<
  PhotoModel,
  IPhotoAdapterOptions
> {
  tableName(): string {
    return "photo";
  }

  protected adaptToModel(
    data: any,
    _options: IPhotoAdapterOptions
  ): Promise<PhotoModel> {
    return new Promise((resolve) => {
      const photo = new PhotoModel();

      photo.photoId = +data?.photo_id;
      photo.filePath = data?.file_path;

      resolve(photo);
    });
  }

  public async add(
    data: IAddPhoto,
    options: IPhotoAdapterOptions = {}
  ): Promise<PhotoModel> {
    return this.baseAdd(data, options);
  }

  public async getAllByDocumentId(
    documentId: number,
    options: IPhotoAdapterOptions = {}
  ): Promise<PhotoModel[]> {
    return this.getAllByFieldNameAndValue("document_id", documentId, options);
  }

  public async deleteById(photoId: number): Promise<true> {
    return this.baseDeleteById(photoId);
  }
}
