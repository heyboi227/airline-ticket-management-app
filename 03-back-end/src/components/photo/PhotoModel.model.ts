import IModel from "../../common/IModel.interface";

export default class PhotoModel implements IModel {
    photoId: number;
    filePath: string;
}
