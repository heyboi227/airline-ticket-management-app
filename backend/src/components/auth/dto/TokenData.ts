export default interface TokenData {
  role: "user" | "administrator";
  id: number;
  identity: string;
}
