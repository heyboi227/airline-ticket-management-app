import { Request, Response } from "express";
import BaseController from "../../common/BaseController";
import { AdministratorLoginDto } from "./dto/AdministratorLogin.dto";
import * as bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken";
import TokenData from "./dto/TokenData";
import { DevConfig } from "../../configs";
import AuthMiddleware from "../../middleware/AuthMiddleware";
import { UserLoginDto } from "./dto/UserLogin.dto";
import { DefaultAdministratorAdapterOptions } from "../administrator/AdministratorService.service";
import StatusError from "../../common/StatusError";
import escapeHTML = require("escape-html");

export default class AuthController extends BaseController {
  public async administratorLogin(req: Request, res: Response) {
    const data = req.body as AdministratorLoginDto;

    this.services.administrator
      .getByUsername(data.username, DefaultAdministratorAdapterOptions)
      .then((result) => {
        if (result === null) {
          throw new StatusError(404, "Administrator account not found!");
        }

        return result;
      })
      .then((administrator) => {
        if (!bcrypt.compareSync(data.password, administrator.passwordHash)) {
          throw new StatusError(404, "Administrator account not found!");
        }

        return administrator;
      })
      .then((administrator) => {
        const tokenData: TokenData = {
          role: "administrator",
          id: administrator.administratorId,
          identity: administrator.username,
        };

        const authToken = jwt.sign(
          tokenData,
          DevConfig.auth.administrator.tokens.auth.keys.private,
          {
            algorithm: DevConfig.auth.administrator.algorithm,
            issuer: DevConfig.auth.administrator.issuer,
            expiresIn: DevConfig.auth.administrator.tokens.auth.duration,
          }
        );

        const refreshToken = jwt.sign(
          tokenData,
          DevConfig.auth.administrator.tokens.refresh.keys.private,
          {
            algorithm: DevConfig.auth.administrator.algorithm,
            issuer: DevConfig.auth.administrator.issuer,
            expiresIn: DevConfig.auth.administrator.tokens.refresh.duration,
          }
        );

        res.send({
          authToken: authToken,
          refreshToken: refreshToken,
          id: administrator.administratorId,
        });
      })
      .catch((error) => {
        setTimeout(() => {
          const safeOutput = escapeHTML(error?.message);
          res.status(error?.status ?? 500).send(safeOutput);
        }, 1500);
      });
  }

  administratorRefresh(req: Request, res: Response) {
    const refreshTokenHeader: string = req.headers?.authorization ?? ""; // "Bearer TOKEN"

    try {
      const tokenData = AuthMiddleware.validateTokenAs(
        refreshTokenHeader,
        "administrator",
        "refresh"
      );

      const authToken = jwt.sign(
        tokenData,
        DevConfig.auth.administrator.tokens.auth.keys.private,
        {
          algorithm: DevConfig.auth.administrator.algorithm,
          issuer: DevConfig.auth.administrator.issuer,
          expiresIn: DevConfig.auth.administrator.tokens.auth.duration,
        }
      );

      res.send({
        authToken: authToken,
      });
    } catch (error) {
      const safeOutput = escapeHTML(error?.message);
      res.status(error?.status ?? 500).send(safeOutput);
    }
  }

  public async userLogin(req: Request, res: Response) {
    const data = req.body as UserLoginDto;

    this.services.user
      .getByEmail(data.email)
      .then((result) => {
        if (result === null) {
          throw new StatusError(404, "User account not found!");
        }

        return result;
      })
      .then((user) => {
        if (!bcrypt.compareSync(data.password, user.passwordHash)) {
          throw new StatusError(404, "User account not found!");
        }

        return user;
      })
      .then((user) => {
        if (!user.isActive) {
          throw new StatusError(404, "User account is not active!");
        }

        return user;
      })
      .then((user) => {
        const tokenData: TokenData = {
          role: "user",
          id: user.userId,
          identity: user.forename + " " + user.surname,
        };

        const authToken = jwt.sign(
          tokenData,
          DevConfig.auth.user.tokens.auth.keys.private,
          {
            algorithm: DevConfig.auth.user.algorithm,
            issuer: DevConfig.auth.user.issuer,
            expiresIn: DevConfig.auth.user.tokens.auth.duration,
          }
        );

        const refreshToken = jwt.sign(
          tokenData,
          DevConfig.auth.user.tokens.refresh.keys.private,
          {
            algorithm: DevConfig.auth.user.algorithm,
            issuer: DevConfig.auth.user.issuer,
            expiresIn: DevConfig.auth.user.tokens.refresh.duration,
          }
        );

        res.send({
          authToken: authToken,
          refreshToken: refreshToken,
          id: user.userId,
        });
      })
      .catch((error) => {
        setTimeout(() => {
          const safeOutput = escapeHTML(error?.message);
          res.status(error?.status ?? 500).send(safeOutput);
        }, 1500);
      });
  }

  userRefresh(req: Request, res: Response) {
    const refreshTokenHeader: string = req.headers?.authorization ?? ""; // "Bearer TOKEN"

    try {
      const tokenData = AuthMiddleware.validateTokenAs(
        refreshTokenHeader,
        "user",
        "refresh"
      );

      const authToken = jwt.sign(
        tokenData,
        DevConfig.auth.user.tokens.auth.keys.private,
        {
          algorithm: DevConfig.auth.user.algorithm,
          issuer: DevConfig.auth.user.issuer,
          expiresIn: DevConfig.auth.user.tokens.auth.duration,
        }
      );

      res.send({
        authToken: authToken,
      });
    } catch (error) {
      const safeOutput = escapeHTML(error?.message);
      res.status(error?.status ?? 500).send(safeOutput);
    }
  }
}
