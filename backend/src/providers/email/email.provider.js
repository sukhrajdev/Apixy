import nodemailer from "nodemailer";
import path from "node:path";
import fs from "node:fs";
import { template } from "./templates/verification.template.js";
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // use STARTTLS (upgrade connection to TLS after connecting)
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASSWORD,
  },
});

export async function sendVerifyEmail(username, email, verificationCode) {
    try {
    const verificationLink = `http://localhost:3000/verify/${verificationCode}`
  

// const template = fs.readFileSync('./templates/verification.template.html', "utf8");

    const html = template
      .replace(/{{username}}/g, username)
      .replace(/{{verificationLink}}/g, verificationLink);

    const info = await transporter.sendMail({
        from: '"Apixy Support Team" <apixy@support.com>', 
        to: email, 
        subject: "Verify,Your Email Address", 
        html
    });

    return "Email Sent Successfully";
  } catch (err) {
    throw new Error(err.message);
  }
}
