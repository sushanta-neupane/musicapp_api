import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

export const transportConfig = {
  host: process.env.SMTP_HOST!,
  port: parseInt(process.env.SMTP_PORT!),
  secure: JSON.parse(process.env.SMTP_IS_SECURE!.toLowerCase()),
  auth: {
    user: process.env.SMTP_USER!,
    pass: process.env.SMTP_PASS!,
  },
};

export const mailTransporter = nodemailer.createTransport(transportConfig);
