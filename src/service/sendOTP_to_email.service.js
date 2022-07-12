import * as dotenv from "dotenv";
dotenv.config();
import otpGenerator from "otp-generator";
import OTP from "../model/otp.model";
import { encode } from "../middleware/crypt";
import nodemailer from "nodemailer";

function AddMinutesToDate(date, minutes) {
  return new Date(date.getTime() + minutes * 60000);
}

export async function Send(input) {
  try {
    const { email, type } = input;

    //Generate OTP
    const otp = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
    });
    const now = new Date();
    const expiration_time = AddMinutesToDate(now, 10);

    const otp_instance = await OTP.create({
      otp: otp,
      expiration_time: expiration_time,
    });

    const details = {
      timestamp: now,
      check: input.email,
      success: true,
      message: "OTP sent to user",
      otp_id: otp_instance._id,
    };

    const encoded = await encode(JSON.stringify(details));

    if (type == "VERIFICATION") {
      const {
        message,
        subject_mail,
      } = require("../templates/email/verification");

      email_message = message(otp);
      email_subject = subject_mail;
    } else if (type == "FORGET") {
      const { message, subject_mail } = require("../templates/email/forget");
      email_message = message(otp);
      email_subject = subject_mail;
    } else if (type == "2FA") {
      const { message, subject_mail } = require("../template/email/2FA");
      email_message = message(otp);
      email_subject = subject_mail;
    } else {
      throw new Error();
    }

    const transporter = nodemailer.createTransport({
      host: "gmail",
      port: 465,
      secure: true,
      auth: {
        user: `${process.env.EMAIL_ADDRESS}`,
        pass: `${process.env.EMAIL_PASSWORD}`,
      },
    });

    const mailOptions = {
      from: `"Victor Soares"<${process.env.EMAIL_ADDRESS}`,
      to: `${email}`,
      subject: email_subject,
      text: email_message,
    };

    await transporter.verify();

    //Send Email
    await transporter.sendMail(mailOptions, (err, response) => {
      if (err) {
        throw new Error(err);
      } else {
        return { Status: "Success", Details: encoded };
      }
    });
  } catch (error) {
    throw new Error(error);
  }
}
