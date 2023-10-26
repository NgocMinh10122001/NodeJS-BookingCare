// const nodemailer = require("nodemailer");
import nodemailer from "nodemailer";
import "dotenv/config";

const sendEmail = async (dataSend) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL_APP,
      pass: process.env.EMAIl_APP_PASSWORD,
    },
  });

  // async..await is not allowed in global scope, must use a wrapper

  // send mail with defined transport object
  const info = await transporter.sendMail({
    from: '"Doctor Minh 👻" <foo@example.com>', // sender address
    to: dataSend.email, // list of receivers
    subject: "Lich kham benh ✔", // Subject line
    // text: "Hello world?", // plain text body
    html:
      dataSend.lang === "vi"
        ? `
        <h3>Xin chao ${dataSend.patientName}!</h3>
        <p>Ban nhan duoc email nay vi da dat lich kham benh online tren Booking Care</p>
        <p>Thong tin kham benh:</p>
        <div><b>Thoi gian : ${dataSend.timeVi}</b></div>
        <div><b>Bac si : ${dataSend.doctorName}</b></div>

        <p>Neu cac thong tin la dung su that, vui long click vao duong link ben duoi de xac nhan
            va hoan tat thu tuc kham benh 
        </p>
        <div>
            <a href="${dataSend.linkConfirm}">Link xac nhan</a>
        </div>

      `
        : `
        <h3>Hello ${dataSend.patientName}!</h3>
        <p>You received this email because you booked an online medical appointment on Booking Care</p>
        <p>Medical examination information :</p>
        <div><b>Time : ${dataSend.timeEn}</b></div>
        <div><b>Doctor : ${dataSend.doctorName}</b></div>

        <p>If the information is true, please click on the link below to confirm and complete the medical examination procedure </p>
        <div>
            <a href="${dataSend.linkConfirm}">Confirm link</a>
        </div>

      `, // html body
  });
};
module.exports = {
  sendEmail,
};
