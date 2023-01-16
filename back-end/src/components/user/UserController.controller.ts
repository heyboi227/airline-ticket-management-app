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
        setTimeout(() => {
          res.status(500).send(error?.message);
        }, 300);
      });
  }

  getById(req: Request, res: Response) {
    const userId: number = +req.params?.uid;

    if (req.authorization?.role === "user") {
      if (req.authorization?.id !== userId) {
        return res.status(403).send("You do not have access to this resource!");
      }
    }

    this.services.user
      .getById(userId, {
        removePassword: true,
        removeActivationCode: true,
      })
      .then((result) => {
        if (result === null) {
          throw {
            status: 404,
            message: "The user is not found!",
          };
        }

        res.send(result);
      })
      .catch((error) => {
        setTimeout(() => {
          res.status(error?.status ?? 500).send(error?.message);
        }, 300);
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
      .startTransaction()
      .then(() => {
        return this.services.user.getByEmail(data.email, {
          removeActivationCode: false,
          removePassword: true,
        });
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
      .then(async (user) => {
        await this.services.user.commitChanges();
        return this.sendRecoveryEmail(user);
      })
      .then(() => {
        res.send({
          message: "Sent",
        });
      })
      .catch(async (error) => {
        await this.services.user.rollbackChanges();
        setTimeout(() => {
          res.status(error?.status ?? 500).send(error?.message);
        }, 500);
      });
  }

  activate(req: Request, res: Response) {
    const activationCode: string = req.params?.acode;

    this.services.user
      .startTransaction()
      .then(() => {
        return this.services.user.getByActivationCode(activationCode, {
          removeActivationCode: true,
          removePassword: true,
        });
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
      .then(async (user) => {
        await this.services.user.commitChanges();
        return this.sendActivationEmail(user);
      })
      .then((user) => {
        res.send(user);
      })
      .catch(async (error) => {
        await this.services.user.rollbackChanges();
        setTimeout(() => {
          res.status(error?.status ?? 500).send(error?.message);
        }, 500);
      });
  }

  resetPassword(req: Request, res: Response) {
    const passwordResetCode: string = req.params?.rcode;

    this.services.user
      .startTransaction()
      .then(() => {
        return this.services.user.getByPasswordResetCode(passwordResetCode, {
          removeActivationCode: false,
          removePassword: true,
        });
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
              .startTransaction()
              .then(() => {
                return this.services.user.editById(
                  user.userId,
                  {
                    password_hash: passwordHash,
                    password_reset_code: null,
                  },
                  {
                    removeActivationCode: true,
                    removePassword: true,
                  }
                );
              })
              .then(async (user) => {
                await this.services.user.commitChanges();
                return this.sendNewPassword(user, newPassword);
              })
              .then((user) => {
                resolve({
                  user: user,
                  newPassword: newPassword,
                });
              })
              .catch(async (error) => {
                await this.services.user.rollbackChanges();
                throw error;
              });
          }
        );
      })
      .then(async () => {
        await this.services.user.commitChanges();
        res.send({
          message: "Sent!",
        });
      })
      .catch(async (error) => {
        await this.services.user.rollbackChanges();
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
    const userId: number = +req.params?.uid;
    const data = req.body as IEditUserDto;

    if (req.authorization?.role === "user") {
      if (req.authorization?.id !== userId) {
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
      .startTransaction()
      .then(() => {
        return this.services.user.editById(userId, serviceData);
      })
      .then(async (result) => {
        await this.services.user.commitChanges();
        res.send(result);
      })
      .catch(async (error) => {
        await this.services.user.rollbackChanges();
        setTimeout(() => {
          res.status(500).send(error?.message);
        }, 500);
      });
  }

  addAddress(req: Request, res: Response) {
    const data = req.body as IAddAddressDto;
    const userId = req.authorization?.id;

    if (!AddAddressValidator(data)) {
      return res.status(400).send(AddAddressValidator.errors);
    }

    this.services.address
      .startTransaction()
      .then(() => {
        return this.services.address.add(
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
        );
      })
      .then(async (address) => {
        await this.services.address.commitChanges();
        res.send(address);
      })
      .catch(async (error) => {
        await this.services.address.rollbackChanges();
        setTimeout(() => {
          res.status(500).send(error?.message);
        }, 500);
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
      .startTransaction()
      .then(() => {
        return this.services.address.getById(addressId, {
          loadUserData: true,
          loadCountryData: true,
        });
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
      .then(async (address) => {
        await this.services.address.commitChanges();
        res.send(address);
      })
      .catch(async (error) => {
        await this.services.address.rollbackChanges();
        setTimeout(() => {
          res.status(error?.status ?? 500).send(error?.message);
        }, 300);
      });
  }
}
