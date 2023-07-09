import Address from "./Address.model";

export default interface User {
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
  addresses: Address[];
}
