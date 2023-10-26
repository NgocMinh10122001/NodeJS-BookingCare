import db from "../models/index";
import emailService from "../services/emailService";
import { v4 as uuidv4 } from "uuid";
import "dotenv/config";
import { where } from "sequelize";

const handleBookAppointment = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!data && !data.email) {
        resolve({
          errCode: 1,
          errMessage: "Missing Info!",
          data: [],
        });
      } else {
        let token = uuidv4();
        let linkConfirm = `${process.env.URL_REACT}/confirm-booking-appointment?token=${token}&doctorId=${data.doctorId}`;
        await emailService.sendEmail({
          email: data.email,
          patientName: data.fullName,
          doctorName: data.doctorName,
          timeVi: data.timeVi,
          timeEn: data.timeEn,
          lang: data.lang,
          linkConfirm: linkConfirm,
        });
        // update and insert
        let user = await db.User.findOrCreate({
          where: { email: data.email },
          defaults: {
            email: data.email,
            roleId: "R3",
            gender: data.gender,
          },
        });
        if (user && user[0]) {
          await db.Booking.findOrCreate({
            where: { patientId: user[0].id },
            defaults: {
              statusId: "S1",
              doctorId: data.doctorId,
              patientId: user[0].id,
              date: data.birthday,
              timeType: data.timeType,
              token: token,
            },
          });
        }
        resolve({
          errCode: 0,
          errMessage: "success book Info",
          data: linkConfirm,
        });
      }
    } catch (error) {
      console.log("chcek err", error);
      reject(error);
    }
  });
};

const updateStatusBooking = (token, doctorId) => {
  return new Promise(async (resolve, reject) => {
    try {
      let res = await db.Booking.findOne({
        where: { token: token, doctorId: doctorId },
        raw: false,
        nest: true,
      });
      if (res) {
        res.statusId = "S2";
        await res.save();
      } else {
        resolve({
          errCode: 1,
          errMessage: "Confirm booking failure!",
        });
      }
      resolve({
        errCode: 0,
        errMessage: "Confirm booking appointment success!",
      });
    } catch (error) {
      console.log("err from server", error);
      reject(error);
    }
  });
};

module.exports = {
  handleBookAppointment,
  updateStatusBooking,
};
