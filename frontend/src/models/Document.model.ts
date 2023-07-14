import Country from "./Country.model";
import User from "./User.model";

export default interface UserDocument {
  documentId: number;
  countryId: number;
  documentType: "Passport" | "National ID";
  documentNumber: string;
  userId: number;

  country?: Country;
  user?: User;
}
