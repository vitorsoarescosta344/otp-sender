import OTP from "../model/otp.model";
import express from "express";
const router = express.Router();
import { encode } from "../middleware/crypt";
import validateRequest from "../middleware/validateRequest";
import otpGenerator from "otp-generator";
import nodemailer from "nodemailer";

function AddMinutesToDate(date, minutes) {
  return new Date(date.getTime() + minutes * 60000);
}

router.post("/email/otp");
