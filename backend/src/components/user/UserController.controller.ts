import {
  EditAddressValidator,
  EditAddress,
  EditAddressDto,
} from "./dto/EditAddress.dto";
import { AddAddressValidator, AddAddressDto } from "./dto/AddAddress.dto";
import { Request, Response } from "express";
import BaseController from "../../common/BaseController";
import { RegisterUserDto, RegisterUserValidator } from "./dto/RegisterUser.dto";
import * as bcrypt from "bcrypt";
import EditUser, { EditUserValidator, EditUserDto } from "./dto/EditUser.dto";
import * as uuid from "uuid";
import UserModel from "./UserModel.model";
import { DevConfig } from "../../configs";
import {
  PasswordResetDto,
  PasswordResetValidator,
} from "./dto/PasswordReset.dto";
import * as generatePassword from "generate-password";
import StatusError from "../../common/StatusError";
import EmailController from "../email/EmailController.controller";
import escapeHTML = require("escape-html");

export default class UserController extends BaseController {
  emailController: EmailController = new EmailController(this.services);

  getAll(_req: Request, res: Response) {
    this.services.user
      .getAll({
        removePassword: true,
        removeActivationCode: true,
        removePasswordResetCode: true,
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
        removePasswordResetCode: true,
      })
      .then((result) => {
        if (result === null) {
          throw new StatusError(404, "The user is not found!");
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
    const body = req.body as RegisterUserDto;

    if (!RegisterUserValidator(body)) {
      const safeOutput = escapeHTML(
        JSON.stringify(RegisterUserValidator.errors)
      );
      return res.status(400).send(safeOutput);
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
        return this.emailController.sendRegistrationEmail(user);
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

  passwordResetEmailSend(req: Request, res: Response) {
    const data = req.body as PasswordResetDto;

    if (!PasswordResetValidator(data)) {
      const safeOutput = escapeHTML(
        JSON.stringify(PasswordResetValidator.errors)
      );
      return res.status(400).send(safeOutput);
    }

    this.services.user
      .startTransaction()
      .then(() => {
        return this.services.user.getByEmail(data.email, {
          removeActivationCode: false,
          removePassword: true,
          removePasswordResetCode: false,
        });
      })
      .then((result) => {
        if (result === null) {
          throw new StatusError(404, "The user is not found!");
        }

        return result;
      })
      .then((user) => {
        if (!user.isActive && !user.activationCode) {
          throw new StatusError(
            403,
            "Your account has been deactivated by the administrator!"
          );
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
            removePasswordResetCode: false,
          }
        );
      })
      .then(async (user) => {
        await this.services.user.commitChanges();
        return this.emailController.sendRecoveryEmail(user);
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
          removePasswordResetCode: true,
        });
      })
      .then((result) => {
        if (result === null) {
          throw new StatusError(404, "The user is not found!");
        }

        return result;
      })
      .then((result) => {
        const user = result;

        return this.services.user.editById(user.userId, {
          is_active: 1,
          activation_code: null,
        });
      })
      .then(async (user) => {
        await this.services.user.commitChanges();
        return this.emailController.sendActivationEmail(user);
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
          removePasswordResetCode: false,
        });
      })
      .then((result) => {
        if (result === null) {
          throw new StatusError(404, "The user is not found!");
        }

        return result;
      })
      .then((user) => {
        if (!user.isActive && !user.activationCode) {
          throw new StatusError(
            403,
            "Your account has been deactivated by the administrator!"
          );
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
                    removePasswordResetCode: false,
                  }
                );
              })
              .then(async (user) => {
                await this.services.user.commitChanges();
                return this.emailController.sendNewPassword(user, newPassword);
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

  editById(req: Request, res: Response) {
    const userId: number = +req.params?.uid;
    const data = req.body as EditUserDto;

    if (req.authorization?.role === "user") {
      if (req.authorization?.id !== userId) {
        return res.status(403).send("You do not have access to this resource!");
      }
    }

    if (!EditUserValidator(data)) {
      const safeOutput = escapeHTML(JSON.stringify(EditUserValidator.errors));
      return res.status(400).send(safeOutput);
    }

    const serviceData: EditUser = {};

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
    const data = req.body as AddAddressDto;
    const userId = req.authorization?.id;

    if (!AddAddressValidator(data)) {
      const safeOutput = escapeHTML(JSON.stringify(AddAddressValidator.errors));
      return res.status(400).send(safeOutput);
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
    const data = req.body as EditAddressDto;
    const userId = req.authorization?.id;

    if (!EditAddressValidator(data)) {
      const safeOutput = escapeHTML(
        JSON.stringify(EditAddressValidator.errors)
      );
      return res.status(400).send(safeOutput);
    }

    const serviceData: EditAddress = {};

    if (data.streetAndNumber !== undefined) {
      serviceData.street_and_number = data.streetAndNumber;
    }

    if (data.zipCode !== undefined) {
      serviceData.zip_code = data.zipCode;
    }

    if (data.city !== undefined) {
      serviceData.city = data.city;
    }

    if (data.phoneNumber !== undefined) {
      serviceData.phone_number = data.phoneNumber;
    }

    if (data.countryId !== undefined) {
      serviceData.country_id = data.countryId;
    }

    if (data.isActive !== undefined) {
      serviceData.is_active = +data.isActive;
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
          throw new StatusError(403, "The address is not found!");
        }

        return result;
      })
      .then((address) => {
        if (address.userId !== userId) {
          throw new StatusError(
            403,
            "You do not have access to this resource!"
          );
        }

        return address;
      })
      .then(() => {
        return this.services.address.editById(addressId, serviceData, {
          loadUserData: true,
          loadCountryData: false,
        });
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
