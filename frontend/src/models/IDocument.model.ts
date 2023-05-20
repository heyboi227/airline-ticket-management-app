import ICountry from "./ICountry.model";
import IUser from "./IUser.model";

export default interface IDocument {
  documentId: number;
  countryId: number;
  documentType: "Passport" | "National ID";
  documentNumber: string;
  userId: number;

  country?: ICountry;
  user?: IUser;
}
