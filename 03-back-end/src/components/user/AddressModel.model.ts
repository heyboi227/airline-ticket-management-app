import IModel from "../../common/IModel.interface";
import UserModel from "./UserModel.model";

export default class AddressModel implements IModel {
  addressId: number;
  userId: number;

  streetAndNumber: string;
  zipCode: number;
  city: string;
  country: string;
  phoneNumber: string;
  isActive: boolean;

  user?: UserModel;
}
