import { EditAddressValidator, IEditAddressDto } from "./dto/IEditAddress.dto";
import { AddAddressValidator, IAddAddressDto } from "./dto/IAddAddress.dto";
import { Request, Response } from "express";
import BaseController from "../../common/BaseController";
import {
  IRegisterUserDto,
  RegisterUserValidator,
} from "./dto/IRegisterUser.dto";
import * as bcrypt from "bcrypt";
import IEditUser, {
  EditUserValidator,
  IEditUserDto,
} from "./dto/IEditUser.dto";
import * as uuid from "uuid";
import UserModel from "./UserModel.model";
import * as nodemailer from "nodemailer";
import * as Mailer from "nodemailer/lib/mailer";
import { DevConfig } from "../../configs";
import {
  IPasswordResetDto,
  PasswordResetValidator,
} from "./dto/IPasswordReset.dto";
import * as generatePassword from "generate-password";

export default class UserController extends BaseController {
  getAll(_req: Request, res: Response) {
    this.services.user
      .getAll({
        removePassword: true,
        removeActivationCode: true,
      })
      .then((result) => {
        res.send(result);
      })
      .catch((error) => {
        res.status(500).send(error?.message);
      });
  }

  getById(req: Request, res: Response) {
    const id: number = +req.params?.id;

    if (req.authorization?.role === "user") {
      if (req.authorization?.id !== id) {
        return res.status(403).send("You do not have access to this resource!");
      }
    }

    this.services.user
      .getById(id, {
        removePassword: true,
        removeActivationCode: true,
      })
      .then((result) => {
        if (result === null) {
          res.status(404).send("User not found!");
        }

        res.send(result);
      })
      .catch((error) => {
        res.status(500).send(error?.message);
      });
  }

  register(req: Request, res: Response) {
    const body = req.body as IRegisterUserDto;

    if (!RegisterUserValidator(body)) {
      return res.status(400).send(RegisterUserValidator.errors);
    }

    const passwordHash = bcrypt.hashSync(body.password, 10);

    this.services.user
      .startTransaction()
      .then(() => {
        return this.services.user.add({
          email: body.email,
          password_hash: passwordHash,
          forename: body.forename,
          surname: body.surname,
          activation_code: uuid.v4(),
        });
      })
      .then((user) => {
        return this.sendRegistrationEmail(user);
      })
      .then(async (user) => {
        await this.services.user.commitChanges();
        return user;
      })
      .then((user) => {
        user.activationCode = null;
        res.send(user);
      })
      .catch(async (error) => {
        await this.services.user.rollbackChanges();
        res.status(500).send(error?.message);
      });
  }

  private async sendRegistrationEmail(user: UserModel): Promise<UserModel> {
    return new Promise((resolve, reject) => {
      const transport = this.getMailTransport();

      const mailOptions: Mailer.Options = {
        to: user.email,
        subject: "Account registration",
        html: `<!doctype html>
                        <html>
                            <head><meta charset="utf-8"></head>
                            <body>
                                <p>
                                    Dear ${user.forename} ${user.surname},<br>
                                    Your account was successfully created.
                                </p>
                                <p>
                                    You must activate you account by clicking on the following link:
                                </p>
                                <p style="text-align: center; padding: 10px;">
                                    <a href="http://localhost:10000/api/user/activate/${user.activationCode}">Activate</a>
                                </p>
                            </body>
                        </html>`,
      };

      transport
        .sendMail(mailOptions)
        .then(() => {
          transport.close();

          user.activationCode = null;

          resolve(user);
        })
        .catch((error) => {
          transport.close();

          reject({
            message: error?.message,
          });
        });
    });
  }

  passwordResetEmailSend(req: Request, res: Response) {
    const data = req.body as IPasswordResetDto;

    if (!PasswordResetValidator(data)) {
      return res.status(400).send(PasswordResetValidator.errors);
    }

    this.services.user
      .getUserByEmail(data.email, {
        removeActivationCode: false,
        removePassword: true,
      })
      .then((result) => {
        if (result === null) {
          throw {
            status: 404,
            message: "User not found!",
          };
        }

        return result;
      })
      .then((user) => {
        if (!user.isActive && !user.activationCode) {
          throw {
            status: 403,
            message: "Your account has been deactivated by the administrator!",
          };
        }

        return user;
      })
      .then((user) => {
        const code = uuid.v4() + "-" + uuid.v4();

        return this.services.user.editById(
          user.userId,
          {
            password_reset_code: code,
          },
          {
            removeActivationCode: true,
            removePassword: true,
          }
        );
      })
      .then((user) => {
        return this.sendRecoveryEmail(user);
      })
      .then(() => {
        res.send({
          message: "Sent",
        });
      })
      .catch((error) => {
        setTimeout(() => {
          res.status(error?.status ?? 500).send(error?.message);
        }, 500);
      });
  }

  activate(req: Request, res: Response) {
    const code: string = req.params?.code;

    this.services.user
      .getUserByActivateionCode(code, {
        removeActivationCode: true,
        removePassword: true,
      })
      .then((result) => {
        if (result === null) {
          throw {
            status: 404,
            message: "User not found!",
          };
        }

        return result;
      })
      .then((result) => {
        const user = result as UserModel;

        return this.services.user.editById(user.userId, {
          is_active: 1,
          activation_code: null,
        });
      })
      .then((user) => {
        return this.sendActivationEmail(user);
      })
      .then((user) => {
        res.send(user);
      })
      .catch((error) => {
        setTimeout(() => {
          res.status(error?.status ?? 500).send(error?.message);
        }, 500);
      });
  }

  resetPassword(req: Request, res: Response) {
    const code: string = req.params?.code;

    this.services.user
      .getUserByPasswordResetCode(code, {
        removeActivationCode: false,
        removePassword: true,
      })
      .then((result) => {
        if (result === null) {
          throw {
            status: 404,
            message: "User not found!",
          };
        }

        return result;
      })
      .then((user) => {
        if (!user.isActive && !user.activationCode) {
          throw {
            status: 403,
            message: "Your account has been deactivated by the administrator",
          };
        }

        return user;
      })
      .then((user) => {
        const newPassword = generatePassword.generate({
          numbers: true,
          uppercase: true,
          lowercase: true,
          symbols: false,
          length: 18,
        });

        const passwordHash = bcrypt.hashSync(newPassword, 10);

        return new Promise<{ user: UserModel; newPassword: string }>(
          (resolve) => {
            this.services.user
              .editById(
                user.userId,
                {
                  password_hash: passwordHash,
                  password_reset_code: null,
                },
                {
                  removeActivationCode: true,
                  removePassword: true,
                }
              )
              .then((user) => {
                return this.sendNewPassword(user, newPassword);
              })
              .then((user) => {
                resolve({
                  user: user,
                  newPassword: newPassword,
                });
              })
              .catch((error) => {
                throw error;
              });
          }
        );
      })
      .then(() => {
        res.send({
          message: "Sent!",
        });
      })
      .catch((error) => {
        setTimeout(() => {
          res.status(error?.status ?? 500).send(error?.message);
        }, 500);
      });
  }

  private getMailTransport() {
    return nodemailer.createTransport(
      {
        host: DevConfig.mail.host,
        port: DevConfig.mail.port,
        secure: false,
        tls: {
          ciphers: "SSLv3",
        },
        debug: DevConfig.mail.debug,
        auth: {
          user: DevConfig.mail.email,
          pass: DevConfig.mail.password,
        },
      },
      {
        from: DevConfig.mail.email,
      }
    );
  }

  private async sendActivationEmail(user: UserModel): Promise<UserModel> {
    return new Promise((resolve, reject) => {
      const transport = this.getMailTransport();

      const mailOptions: Mailer.Options = {
        to: user.email,
        subject: "Account activation",
        html: `<!doctype html>
                        <html>
                            <head><meta charset="utf-8"></head>
                            <body>
                                <p>
                                    Dear ${user.forename} ${user.surname},<br>
                                    Your account was successfully activated.
                                </p>
                                <p>
                                    You can now log into your account using the login form.
                                </p>
                            </body>
                        </html>`,
      };

      transport
        .sendMail(mailOptions)
        .then(() => {
          transport.close();

          user.activationCode = null;
          user.passwordResetCode = null;

          resolve(user);
        })
        .catch((error) => {
          transport.close();

          reject({
            message: error?.message,
          });
        });
    });
  }

  private async sendNewPassword(
    user: UserModel,
    newPassword: string
  ): Promise<UserModel> {
    return new Promise((resolve, reject) => {
      const transport = this.getMailTransport();

      const mailOptions: Mailer.Options = {
        to: user.email,
        subject: "New password",
        html: `<!doctype html>
                        <html>
                            <head><meta charset="utf-8"></head>
                            <body>
                                <p>
                                    Dear ${user.forename} ${user.surname},<br>
                                    Your account password was successfully reset.
                                </p>
                                <p>
                                    Your new password is:<br>
                                    <pre style="padding: 20px; font-size: 24pt; color: #000; background-color: #eee; border: 1px solid #666;">${newPassword}</pre>
                                </p>
                                <p>
                                    You can now log into your account using the login form.
                                </p>
                            </body>
                        </html>`,
      };

      transport
        .sendMail(mailOptions)
        .then(() => {
          transport.close();

          user.activationCode = null;
          user.passwordResetCode = null;

          resolve(user);
        })
        .catch((error) => {
          transport.close();

          reject({
            message: error?.message,
          });
        });
    });
  }

  private async sendRecoveryEmail(user: UserModel): Promise<UserModel> {
    return new Promise((resolve, reject) => {
      const transport = this.getMailTransport();

      const mailOptions: Mailer.Options = {
        to: user.email,
        subject: "Account password reset code",
        html: `<!doctype html>
                        <html>
                            <head><meta charset="utf-8"></head>
                            <body>
                                <p>
                                    Dear ${user.forename} ${user.surname},<br>
                                    Here is a link you can use to reset your account:
                                </p>
                                <p>
                                    <a href="http://localhost:10000/api/user/reset/${user.passwordResetCode}"
                                        sryle="display: inline-block; padding: 10px 20px; color: #fff; background-color: #db0002; text-decoration: none;">
                                        Click here to reset your account
                                    </a>
                                </p>
                            </body>
                        </html>`,
      };

      transport
        .sendMail(mailOptions)
        .then(() => {
          transport.close();

          user.activationCode = null;
          user.passwordResetCode = null;

          resolve(user);
        })
        .catch((error) => {
          transport.close();

          reject({
            message: error?.message,
          });
        });
    });
  }

  editById(req: Request, res: Response) {
    const id: number = +req.params?.aid;
    const data = req.body as IEditUserDto;

    if (req.authorization?.role === "user") {
      if (req.authorization?.id !== id) {
        return res.status(403).send("You do not have access to this resource!");
      }
    }

    if (!EditUserValidator(data)) {
      return res.status(400).send(EditUserValidator.errors);
    }

    const serviceData: IEditUser = {};

    if (data.password !== undefined) {
      const passwordHash = bcrypt.hashSync(data.password, 10);
      serviceData.password_hash = passwordHash;
    }

    if (
      DevConfig.auth.allowAllRoutesWithoutAuthTokens ||
      req.authorization?.role === "administrator"
    ) {
      if (data.isActive !== undefined) {
        serviceData.is_active = data.isActive ? 1 : 0;
      }
    }

    if (data.forename !== undefined) {
      serviceData.forename = data.forename;
    }

    if (data.surname !== undefined) {
      serviceData.surname = data.surname;
    }

    this.services.user
      .editById(id, serviceData)
      .then((result) => {
        res.send(result);
      })
      .catch((error) => {
        res.status(500).send(error?.message);
      });
  }

  addAddress(req: Request, res: Response) {
    const data = req.body as IAddAddressDto;
    const userId = req.authorization?.id;

    if (!AddAddressValidator(data)) {
      return res.status(400).send(AddAddressValidator.errors);
    }

    this.services.address
      .add(
        {
          street_and_number: data.streetAndNumber,
          zip_code: data.zipCode,
          city: data.city,
          country_id: data.countryId,
          phone_number: data.phoneNumber,
          user_id: userId,
        },
        {
          loadUserData: true,
          loadCountryData: true,
        }
      )
      .then((address) => {
        res.send(address);
      })
      .catch((error) => {
        res.status(error?.status ?? 500).send(error?.message);
      });
  }

  editAddressById(req: Request, res: Response) {
    const addressId = +req.params?.aid;
    const data = req.body as IEditAddressDto;
    const userId = req.authorization?.id;

    if (!EditAddressValidator(data)) {
      return res.status(400).send(EditAddressValidator.errors);
    }

    this.services.address
      .getById(addressId, {
        loadUserData: true,
        loadCountryData: true,
      })
      .then((result) => {
        if (!result) {
          throw {
            status: 404,
            message: "Address not found!",
          };
        }

        return result;
      })
      .then((address) => {
        if (address.userId !== userId) {
          throw {
            status: 403,
            message: "You do not have access to this resource!",
          };
        }

        return address;
      })
      .then((address) => {
        return this.services.address.editById(
          addressId,
          {
            street_and_number: data.streetAndNumber,
            zip_code: data.zipCode,
            city: data.city,
            country_id: data.countryId,
            phone_number: data.phoneNumber,
            user_id: userId,
            is_active: data?.isActive ?? address.isActive ? 1 : 0,
          },
          {
            loadUserData: true,
            loadCountryData: false,
          }
        );
      })
      .then((address) => {
        res.send(address);
      })
      .catch((error) => {
        res.status(error?.status ?? 500).send(error?.message);
      });
  }
}
