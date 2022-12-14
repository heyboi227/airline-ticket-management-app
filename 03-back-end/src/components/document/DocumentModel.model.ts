import IModel from "../../common/IModel.interface";
import CountryModel from "../country/CountryModel.model";
import PhotoModel from "../photo/PhotoModel.model";
import UserModel from "../user/UserModel.model";

export default class DocumentModel implements IModel {
  documentId: number;
  countryId: number;
  type: "Passport" | "National ID";
  documentNumber: string;
  userId: number;

  country?: CountryModel = null;
  user?: UserModel = null;
  photos?: PhotoModel[] = [];
}
