import { IEditAddress } from "./dto/IEditAddress.dto";
import { IAddAddress } from "./dto/IAddAddress.dto";
import BaseService from "../../common/BaseService";
import IAdapterOptions from "../../common/IAdapterOptions.interface";
import AddressModel from "./AddressModel.model";
import CountryModel from "../country/CountryModel.model";
import UserModel from "./UserModel.model";
import { DefaultUserAdapterOptions } from "./UserService.service";

export interface IAddressAdapterOptions extends IAdapterOptions {
  loadUserData: boolean;
  loadCountryData: boolean;
}

export default class AddressService extends BaseService<
  AddressModel,
  IAddressAdapterOptions
> {
  tableName(): string {
    return "address";
  }

  protected initalizeAddress(data: any): AddressModel {
    const address = new AddressModel();

    address.addressId = +data?.address_id;
    address.userId = +data?.user_id;

    address.streetAndNumber = data?.street_and_number;
    address.city = data?.city;
    address.countryId = +data?.country_id;
    address.phoneNumber = data?.phone_number;

    address.isActive = +data?.is_active === 1;

    return address;
  }

  protected async loadResources(
    address: AddressModel,
    options: IAddressAdapterOptions
  ): Promise<[UserModel | undefined, CountryModel | undefined]> {
    const loadUserDataPromise = options.loadUserData
      ? this.services.user.getById(address.userId, DefaultUserAdapterOptions)
      : Promise.resolve<UserModel | undefined>(undefined);

    const loadCountryDataPromise = options.loadCountryData
      ? this.services.country.getById(address.countryId, {})
      : Promise.resolve<CountryModel | undefined>(undefined);

    const resources = await Promise.all([
      loadUserDataPromise,
      loadCountryDataPromise,
    ]);

    return resources;
  }

  protected assignResources(
    address: AddressModel,
    resources: [UserModel | undefined, CountryModel | undefined],
    options: IAddressAdapterOptions
  ): AddressModel {
    const [userData, countryData] = resources;

    if (options.loadUserData) {
      address.user = userData!;
    }

    if (options.loadCountryData) {
      address.country = countryData!;
    }

    return address;
  }

  protected async adaptToModel(
    data: any,
    options: IAddressAdapterOptions = {
      loadUserData: true,
      loadCountryData: true,
    }
  ): Promise<AddressModel> {
    const address = this.initalizeAddress(data);

    const resources = await this.loadResources(address, options);
    const updatedAddress = this.assignResources(address, resources, options);

    return updatedAddress;
  }

  public async getAllByUserId(
    userId: number,
    options: IAddressAdapterOptions
  ): Promise<AddressModel[]> {
    return this.getAllByFieldNameAndValue("user_id", userId, options);
  }

  public async add(
    data: IAddAddress,
    options: IAddressAdapterOptions
  ): Promise<AddressModel> {
    return this.baseAdd(data, options);
  }

  public async editById(
    addressId: number,
    data: IEditAddress,
    options: IAddressAdapterOptions
  ): Promise<AddressModel> {
    return this.baseEditById(addressId, data, options);
  }
}
