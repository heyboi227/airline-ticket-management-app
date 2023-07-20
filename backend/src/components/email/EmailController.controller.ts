import BaseController from "../../common/BaseController";
import { DevConfig } from "../../configs";
import UserModel from "../user/UserModel.model";
import * as nodemailer from "nodemailer";
import * as Mailer from "nodemailer/lib/mailer";

export default class EmailController extends BaseController {
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

  async sendActivationEmail(user: UserModel): Promise<UserModel> {
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

  async sendNewPassword(
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

  async sendRecoveryEmail(user: UserModel): Promise<UserModel> {
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

  async sendRegistrationEmail(user: UserModel): Promise<UserModel> {
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

  async sendBookingConfirmationEmail(
    email: string,
    bookingNumber: string
  ): Promise<string> {
    return new Promise((resolve, reject) => {
      const transport = this.getMailTransport();

      const mailOptions: Mailer.Options = {
        to: email,
        subject: "Booking confirmation",
        html: `<!doctype html>
                        <html>
                            <head><meta charset="utf-8"></head>
                            <body>
                                <p>
                                    Dear Milos Jeknic,<br>
                                    Your booking was successfully confirmed.
                                </p>
                                <p>
                                    Your booking confirmation number is: <h1>${bookingNumber}</h1>
                                </p>
                            </body>
                        </html>`,
      };

      transport
        .sendMail(mailOptions)
        .then(() => {
          transport.close();
          resolve(email);
        })
        .catch((error) => {
          transport.close();
          reject({
            message: error?.message,
          });
        });
    });
  }
}
