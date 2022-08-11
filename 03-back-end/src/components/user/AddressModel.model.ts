import IModel from "../../common/IModel.interface";
import CountryModel from "../country/CountryModel.model";
import UserModel from "./UserModel.model";

export default class AddressModel implements IModel {
  addressId: number;
  userId: number;

  streetAndNumber: string;
  zipCode: number;
  city: string;
  countryId: number;
  phoneNumber: string;
  isActive: boolean;

  user?: UserModel;
  country?: CountryModel;
}
