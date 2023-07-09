import BaseService from "../../common/BaseService";
import AdministratorModel from "./AdministratorModel.model";
import AddAdministrator from "./dto/AddAdministrator.dto";
import EditAdministrator from "./dto/EditAdministrator.dto";

export class AdministratorAdapterOptions {
  removePassword: boolean;
}

export const DefaultAdministratorAdapterOptions: AdministratorAdapterOptions = {
  removePassword: false,
};

export default class AdministratorService extends BaseService<
  AdministratorModel,
  AdministratorAdapterOptions
> {
  tableName(): string {
    return "administrator";
  }

  protected async adaptToModel(
    data: any,
    options: AdministratorAdapterOptions = DefaultAdministratorAdapterOptions
  ): Promise<AdministratorModel> {
    const administrator = new AdministratorModel();

    administrator.administratorId = +data?.administrator_id;
    administrator.username = data?.username;
    administrator.passwordHash = data?.password_hash;
    administrator.createdAt = data?.created_at;
    administrator.isActive = +data?.is_active === 1;

    if (options.removePassword) {
      administrator.passwordHash = null;
    }

    return administrator;
  }

  public async add(data: AddAdministrator): Promise<AdministratorModel> {
    return this.baseAdd(data, DefaultAdministratorAdapterOptions);
  }

  public async editById(
    administratorId: number,
    data: EditAdministrator,
    options: AdministratorAdapterOptions
  ): Promise<AdministratorModel> {
    return this.baseEditById(administratorId, data, options);
  }

  public async getByUsername(
    username: string,
    options: AdministratorAdapterOptions
  ): Promise<AdministratorModel | null> {
    return new Promise((resolve, reject) => {
      this.getAllByFieldNameAndValue("username", username, options)
        .then((result) => {
          if (result.length === 0) {
            return resolve(null);
          }

          resolve(result[0]);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }
}
