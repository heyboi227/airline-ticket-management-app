import TokenData from "../../src/components/auth/dto/TokenData";

declare global {
  namespace Express {
    interface Request {
      authorization?: TokenData | null;
    }
  }
}
