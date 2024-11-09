// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { SMTPClient } from "emailjs";
import nodemailer from "nodemailer";

type Data = {
  name: string;
};
// let nodemailer = require("nodemailer");

// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  // console.log(process.env)
  const transporter = nodemailer.createTransport({
    port: 465,
    host: "smtp.gmail.com",
    auth: {
      user: "johnnyewsd@gmail.com",
      pass: "zmojubhrjcdeybri",
    },
    secure: true,
  });

  await new Promise((resolve, reject) => {
    // verify connection configuration
    transporter.verify(function (error, success) {
      if (error) {
        console.log(error);
        reject(error);
      } else {
        console.log("Server is ready to take our messages");
        resolve(success);
      }
    });
  });

  const anonymous = req.body?.anonymous;
  const isComment = req.body.isComment;
  const commentText =
    anonymous && isComment
      ? `Anonymous User comment on your post`
      : `${req.body.name} commented on your post`;

  const bodyText = isComment
    ? commentText
    : `New Post has been created by ${req.body.name}`;

  const mailData = {
    from: "johnnyewsd@gmail.com",
    to: req.body.email,
    subject: `New Post Notification`,
    text: bodyText,
    html: `<div>${bodyText}</div>`,
  };

  await new Promise((resolve, reject) => {
    // send mail
    transporter.sendMail(mailData, (err, info) => {
      if (err) {
        console.error(err);
        reject(err);
      } else {
        console.log(info);
        resolve(info);
      }
    });
  });

  res.status(200).end(JSON.stringify({ message: "Send Mail" }));
}
