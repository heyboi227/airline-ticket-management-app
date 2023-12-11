import Country from "./Country.model";
import User from "./User.model";

export default interface UserDocument {
  documentId: number;
  countryId: number;
  documentType: "Passport" | "National ID";
  documentNumber: string;
  documentIssuingDate: string;
  documentExpirationDate: string;
  userId: number;

  country?: Country;
  user?: User;
}
