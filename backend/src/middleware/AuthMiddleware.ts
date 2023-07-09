import { NextFunction, Request, Response } from "express";
import TokenData from "../components/auth/dto/TokenData";
import * as jwt from "jsonwebtoken";
import { DevConfig } from "../configs";
import StatusError from "../common/StatusError";

export default class AuthMiddleware {
  public static getVerifier(
    ...allowedRoles: ("user" | "administrator")[]
  ): (req: Request, res: Response, next: NextFunction) => void {
    return (req: Request, res: Response, next: NextFunction) => {
      this.verifyAuthToken(req, res, next, allowedRoles);
    };
  }

  private static verifyAuthToken(
    req: Request,
    res: Response,
    next: NextFunction,
    allowedRoles: ("user" | "administrator")[]
  ) {
    if (DevConfig.auth.allowAllRoutesWithoutAuthTokens) {
      return next();
    }

    const tokenHeader: string = req.headers?.authorization ?? "";

    try {
      const checks = [];

      for (let role of allowedRoles) {
        try {
          const check = this.validateTokenAs(tokenHeader, role, "auth");

          if (check) {
            checks.push(check);
          }
        } catch (error) {}
      }

      if (checks.length === 0) {
        throw new StatusError(
          403,
          "You are not authorized to access this resource!"
        );
      }

      req.authorization = checks[0];

      next();
    } catch (error) {
      res.status(error?.status ?? 500).send(error?.message);
    }
  }

  public static validateTokenAs(
    tokenString: string,
    role: "user" | "administrator",
    type: "auth" | "refresh"
  ): TokenData {
    if (tokenString === "") {
      throw new StatusError(400, "No token specified!");
    }

    const [tokenType, token] = tokenString.trim().split(" ");

    if (tokenType !== "Bearer") {
      throw new StatusError(401, "Invalid token type!");
    }

    if (typeof token !== "string" || token.length === 0) {
      throw new StatusError(401, "Token not specified!");
    }

    try {
      const tokenVerification = jwt.verify(
        token,
        DevConfig.auth[role].tokens[type].keys.public
      );

      if (!tokenVerification) {
        throw new StatusError(401, "Invalid token specified!");
      }

      const originalTokenData = tokenVerification as TokenData;

      const tokenData: TokenData = {
        role: originalTokenData.role,
        id: originalTokenData.id,
        identity: originalTokenData.identity,
      };

      if (tokenData.role !== role) {
        throw new StatusError(401, "Invalid token role!");
      }

      return tokenData;
    } catch (error) {
      const message: string = error?.message ?? "";

      if (message.includes("jwt expired")) {
        throw new StatusError(401, "This token has expired!");
      }

      throw new StatusError(500, error?.message);
    }
  }
}
