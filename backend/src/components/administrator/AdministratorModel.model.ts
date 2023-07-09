import Model from "../../common/Model.interface";

export default class AdministratorModel implements Model {
  administratorId: number;
  username: string;
  passwordHash?: string;
  createdAt: string;
  isActive: boolean;
}
