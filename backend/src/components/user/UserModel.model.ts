import Model from "../../common/Model.interface";
import AddressModel from "./AddressModel.model";

export default class UserModel implements Model {
  userId: number;
  email: string;
  passwordHash: string | null;
  forename: string;
  surname: string;
  isActive: boolean;
  activationCode: string | null;
  passwordResetCode: string | null;
  addresses?: AddressModel[];
}
