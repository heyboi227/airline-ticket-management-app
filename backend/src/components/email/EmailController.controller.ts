import BaseController from "../../common/BaseController";
import { DevConfig } from "../../configs";
import { BookingConfirmationDto } from "../ticket/dto/BookingConfirmation.dto";
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
    bookingConfirmationData: BookingConfirmationDto
  ): Promise<string> {
    return new Promise((resolve, reject) => {
      const transport = this.getMailTransport();

      const mailOptions: Mailer.Options = {
        to: bookingConfirmationData.email,
        subject: "Booking confirmation",
        html: `<!doctype html>
        <html>
           <head>
              <meta charset="utf-8">
              <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-T3c6CoIi6uLrA9TneNEoa7RxnatzjcDSCmG1MXxSR1GAsXEV/Dwwykc2MPK8M2HN" crossorigin="anonymous">
           </head>
           <body>
              <p>
                 Dear ${
                   bookingConfirmationData.cardHolderFirstName +
                   " " +
                   bookingConfirmationData.cardHolderLastName
                 },<br>
                 Your booking was successfully confirmed.
              </p>
              <p>
                 Your booking confirmation number is: 
              <h1>${bookingConfirmationData.bookingNumber}
              </h1>
              </p>
              <div>
                 <h3>Passenger Details</h3>
                 ${bookingConfirmationData.passengers.map(
                   (passenger) => `
                 <ul class="list-unstyled">
                    <li class="list-group-item">
                       First name: ${passenger.firstName}
                    </li>
                    <li class="list-group-item">
                       Last name: ${passenger.lastName}
                    </li>
                    <li class="list-group-item">
                       Date of birth: ${new Date(
                         passenger.dateOfBirth
                       ).toLocaleDateString("sr", {
                         year: "numeric",
                         month: "numeric",
                         day: "numeric",
                       })}
                    </li>
                 </ul>
                 `
                 )}
                 <h3>Flight Details</h3>
                 <ul class="list-unstyled">
                    <li class="list-group-item">
                       ${
                         bookingConfirmationData.flightDetails.departFlight
                           .flightCode
                       }
                    </li>
                    <li class="list-group-item">
                       Departs:&nbsp;
                       ${new Date(
                         bookingConfirmationData.flightDetails.departFlight.departureDateAndTime
                       ).toLocaleDateString("sr", {
                         year: "numeric",
                         month: "numeric",
                         day: "numeric",
                         hour12: false,
                         hour: "2-digit",
                         minute: "2-digit",
                       })}&nbsp;
                    </li>
                    <li class="list-group-item">
                       Arrives:&nbsp;
                       ${new Date(
                         bookingConfirmationData.flightDetails.departFlight.arrivalDateAndTime
                       ).toLocaleDateString("sr", {
                         year: "numeric",
                         month: "numeric",
                         day: "numeric",
                         hour12: false,
                         hour: "2-digit",
                         minute: "2-digit",
                       })}&nbsp;
                    </li>
                    <li class="list-group-item">
                       Aircraft:&nbsp;
                       ${
                         bookingConfirmationData.flightDetails.departFlight
                           .aircraft.aircraftName
                       }
                    </li>
                 </ul>
                 ${
                   bookingConfirmationData.flightDetails.returnFlight
                     ? `
                 <ul class="list-unstyled">
                    <li class="list-group-item">
                       ${
                         bookingConfirmationData.flightDetails.returnFlight
                           .flightCode
                       }
                    </li>
                    <li class="list-group-item">
                       Departs:&nbsp;
                       ${new Date(
                         bookingConfirmationData.flightDetails.returnFlight.departureDateAndTime
                       ).toLocaleDateString("sr", {
                         year: "numeric",
                         month: "numeric",
                         day: "numeric",
                         hour12: false,
                         hour: "2-digit",
                         minute: "2-digit",
                       })}&nbsp;
                    </li>
                    <li class="list-group-item">
                       Arrives:&nbsp;${new Date(
                         bookingConfirmationData.flightDetails.returnFlight.arrivalDateAndTime
                       ).toLocaleDateString("sr", {
                         year: "numeric",
                         month: "numeric",
                         day: "numeric",
                         hour12: false,
                         hour: "2-digit",
                         minute: "2-digit",
                       })}&nbsp;
                    </li>
                    <li class="list-group-item">
                       Aircraft:&nbsp;${
                         bookingConfirmationData.flightDetails.returnFlight
                           .aircraft.aircraftName
                       }
                    </li>
                 </ul>
                 `
                     : ""
                 }
              </div>
              <div>
                 <h3>Seat Assignment</h3>
                 ${bookingConfirmationData.passengers.map(
                   (passenger) => `
                 <ul class="list-unstyled">
                    <li class="list-group-item">
                       ${
                         bookingConfirmationData.flightDetails.departFlight
                           .flightCode
                       }:&nbsp;
                       ${passenger.departSeat}
                    </li>
                    ${
                      passenger.returnSeat
                        ? `
                    <li class="list-group-item">
                       ${bookingConfirmationData.flightDetails.returnFlight.flightCode}:&nbsp;${passenger.returnSeat}
                    </li>
                    `
                        : ""
                    }
                 </ul>
                 `
                 )}
                 <h3>Baggage Information</h3>
                 <ul class="list-unstyled">
                    <li class="list-group-item">Hand baggage: 1 piece included</li>
                    ${
                      !bookingConfirmationData.flightDetails.departureTravelClass
                        .toLowerCase()
                        .includes("basic") ||
                      !bookingConfirmationData.flightDetails.returnTravelClass
                        .toLowerCase()
                        .includes("basic")
                        ? `
                    <li class="list-group-item">
                       Checked baggage: 1 piece included
                    </li>
                    `
                        : ""
                    }
                 </ul>
              </div>
              <div>
                 <h3>Price Breakdown</h3>
                 <ul class="list-unstyled">
                    <li class="list-group-item">
                       Base price: ${bookingConfirmationData.flightDetails.basePrice.toFixed(
                         2
                       )} RSD
                    </li>
                    <li class="list-group-item">
                       Taxes and fees: ${bookingConfirmationData.flightDetails.taxesAndFeesPrice.toFixed(
                         2
                       )} RSD
                    </li>
                    <li class="list-group-item">
                       Total price: ${bookingConfirmationData.flightDetails.totalPrice.toFixed(
                         2
                       )} RSD
                    </li>
                 </ul>
                 <h3>Travel Document Information</h3>
                 ${bookingConfirmationData.passengers.map(
                   (passenger) => `
                 <ul class="list-unstyled">
                    <li class="list-group-item">
                       Document type: ${passenger.documentType}
                    </li>
                    <li class="list-group-item">
                       Document number: ${passenger.documentNumber}
                    </li>
                    <li class="list-group-item">
                       Issued on: ${new Date(
                         passenger.documentIssuingDate
                       ).toLocaleDateString("sr", {
                         year: "numeric",
                         month: "numeric",
                         day: "numeric",
                       })}
                    </li>
                    <li class="list-group-item">
                       Expires on: ${new Date(
                         passenger.documentExpirationDate
                       ).toLocaleDateString("sr", {
                         year: "numeric",
                         month: "numeric",
                         day: "numeric",
                       })}
                    </li>
                 </ul>
                 `
                 )}
                 <h3>Payment Information</h3>
                 <ul class="list-unstyled">
                    <li class="list-group-item">
                       Card number: ${
                         bookingConfirmationData.paymentDetails.cardNumber
                       }
                    </li>
                    <li class="list-group-item">Status: succesful</li>
                    <li class="list-group-item">
                       Made on: ${new Date(
                         bookingConfirmationData.paymentDetails.paymentTimestamp
                       ).toLocaleDateString("sr", {
                         year: "numeric",
                         month: "numeric",
                         day: "numeric",
                         hour12: false,
                         hour: "2-digit",
                         minute: "2-digit",
                         second: "2-digit",
                       })}
                    </li>
                 </ul>
              </div>
              <div>
                 <h3>Cancellation/Change Policy</h3>
                 <span>No cancellation/change provided</span>
                 <h3>Check-in Information</h3>
                 <p>
                    It is recommended to be present at the check-in counter at least two
                    hours before the flight departure.
                 </p>
                 <p>Selected airports offer online check-in option.</p>
              </div>
              <div>
                 <h3>Contact Information</h3>
                 <span>Emergency number: +381111234567</span>
              </div>
              <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js" integrity="sha384-C6RzsynM9kWDrMNeT87bh95OGNyZPhcTNXj1NW7RuBCsyN/o0jlpcV8Qyq46cDfL" crossorigin="anonymous"></script>
           </body>
        </html>`,
      };
      transport
        .sendMail(mailOptions)
        .then(() => {
          transport.close();
          resolve(bookingConfirmationData.email);
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
