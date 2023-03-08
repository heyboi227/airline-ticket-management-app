import IAddress from "./IAddress.model";

export default interface IUser {
  userId: number;
  username: string;
  email: string | null;
  passwordHash: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string | null;
  activationCode: string | null;
  passwordResetCode: string | null;
  addresses: IAddress[];
}
