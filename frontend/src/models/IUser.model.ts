import IAddress from "./IAddress.model";

export default interface IUser {
  userId: number;
  email: string;
  passwordHash: string | null;
  forename: string;
  surname: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string | null;
  activationCode: string | null;
  passwordResetCode: string | null;
  addresses: IAddress[];
}
