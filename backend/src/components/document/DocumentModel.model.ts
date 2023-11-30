import Model from "../../common/Model.interface";
import CountryModel from "../country/CountryModel.model";
import UserModel from "../user/UserModel.model";

export default class DocumentModel implements Model {
  documentId: number;
  countryId: number;
  documentType: "Passport" | "National ID";
  documentNumber: string;
  documentIssuingDate: string;
  documentExpirationDate: string;
  userId: number;

  country?: CountryModel = null;
  user?: UserModel = null;
}
