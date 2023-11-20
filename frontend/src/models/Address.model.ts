import User from "./User.model";
import Country from "./Country.model";

export default interface Address {
  addressId: number;
  userId: number;
  streetAndNumber: string;
  zipCode: string;
  city: string;
  countryId: number;
  phoneNumber: string;
  isActive: boolean;
  user?: User;
  country?: Country;
}

export function formatAddress(address: Address): string {
  return (
    address.streetAndNumber +
    ", " +
    address.zipCode +
    " " +
    address.city +
    ", " +
    address.country?.countryName +
    " (" +
    address.phoneNumber +
    ")"
  );
}
