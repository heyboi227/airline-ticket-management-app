import BaseService from "../../common/BaseService";
import UserModel from "./UserModel.model";
import { RegisterUser } from "./dto/RegisterUser.dto";
import EditUser from "./dto/EditUser.dto";

export interface UserAdapterOptions {
  removePassword: boolean;
  removeActivationCode: boolean;
  removePasswordResetCode: boolean;
}

export const DefaultUserAdapterOptions: UserAdapterOptions = {
  removePassword: false,
  removeActivationCode: false,
  removePasswordResetCode: false,
};

export default class UserService extends BaseService<
  UserModel,
  UserAdapterOptions
> {
  tableName(): string {
    return "user";
  }

  protected async adaptToModel(
    data: any,
    options: UserAdapterOptions = DefaultUserAdapterOptions
  ): Promise<UserModel> {
    const user = new UserModel();

    user.userId = +data?.user_id;
    user.email = data?.email;
    user.passwordHash = data?.password_hash;
    user.forename = data?.forename;
    user.surname = data?.surname;
    user.isActive = +data?.is_active === 1;
    user.activationCode = data?.activation_code ? data?.activation_code : null;
    user.passwordResetCode = data?.password_reset_code
      ? data?.password_reset_code
      : null;

    if (options.removePassword) {
      user.passwordHash = null;
    }

    if (options.removeActivationCode) {
      user.activationCode = null;
    }

    if (options.removePasswordResetCode) {
      user.passwordResetCode = null;
    }

    user.addresses = await this.services.address.getAllByUserId(user.userId, {
      loadUserData: false,
      loadCountryData: true,
    });

    return user;
  }

  public async add(data: RegisterUser): Promise<UserModel> {
    return this.baseAdd(data, {
      removeActivationCode: false,
      removePassword: true,
      removePasswordResetCode: true,
    });
  }

  public async editById(
    userId: number,
    data: EditUser,
    options: UserAdapterOptions = {
      removePassword: true,
      removeActivationCode: true,
      removePasswordResetCode: true,
    }
  ): Promise<UserModel> {
    return this.baseEditById(userId, data, options);
  }

  public async getByActivationCode(
    activationCode: string,
    option: UserAdapterOptions = DefaultUserAdapterOptions
  ): Promise<UserModel | null> {
    return new Promise((resolve, reject) => {
      this.getAllByFieldNameAndValue("activation_code", activationCode, option)
        .then((result) => {
          if (result.length === 0) {
            return resolve(null);
          }

          resolve(result[0]);
        })
        .catch((error) => {
          reject(error?.message);
        });
    });
  }

  public async getByPasswordResetCode(
    passwordResetCode: string,
    option: UserAdapterOptions = DefaultUserAdapterOptions
  ): Promise<UserModel | null> {
    return new Promise((resolve, reject) => {
      this.getAllByFieldNameAndValue(
        "password_reset_code",
        passwordResetCode,
        option
      )
        .then((result) => {
          if (result.length === 0) {
            return resolve(null);
          }

          resolve(result[0]);
        })
        .catch((error) => {
          reject(error?.message);
        });
    });
  }

  public async getByEmail(
    email: string,
    option: UserAdapterOptions = DefaultUserAdapterOptions
  ): Promise<UserModel | null> {
    return new Promise((resolve, reject) => {
      this.getAllByFieldNameAndValue("email", email, option)
        .then((result) => {
          if (result.length === 0) {
            return resolve(null);
          }

          resolve(result[0]);
        })
        .catch((error) => {
          reject(error?.message);
        });
    });
  }
}
