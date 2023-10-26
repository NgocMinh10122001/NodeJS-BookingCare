import { raw } from "body-parser";
import { where } from "sequelize";
import db from "../models/index";
import _ from "lodash";
import "dotenv/config";
let maxNumber = process.env.MAX_NUMBER_SCHEDULE;
const getTopDoctorHome = (limit) => {
  return new Promise(async (resolve, reject) => {
    // console.log("check 3", limit);
    try {
      let doctors = await db.User.findAll({
        where: { roleId: "R2" },
        limit: limit,
        order: [["createdAt", "DESC"]],
        attributes: {
          exclude: ["password"],
        },
        include: [
          {
            model: db.Allcode,
            as: "positionData",
            attributes: ["valueEn", "valueVi"],
          },
          {
            model: db.Allcode,
            as: "genderData",
            attributes: ["valueEn", "valueVi"],
          },
        ],

        raw: true,
        nest: true,
      });

      resolve({
        errCode: 0,
        errMessage: "get doctor sc",
        data: doctors,
      });
    } catch (e) {
      reject(e);
    }
  });
};

const getAllDoctor = (doctorType) => {
  // console.log("check typr", doctorType);
  return new Promise(async (resolve, reject) => {
    try {
      let doctor = "";
      if (doctorType === "All") {
        doctor = await db.User.findAll({
          where: { roleId: "R2" },
          order: [["createdAt", "DESC"]],
          attributes: {
            exclude: ["password"],
          },
          include: [
            {
              model: db.Allcode,
              as: "positionData",
              attributes: ["valueEn", "valueVi"],
            },
            {
              model: db.Allcode,
              as: "genderData",
              attributes: ["valueEn", "valueVi"],
            },
          ],

          raw: true,
          nest: true,
        });
        // console.log("check doctor", doctor);
      }
      if (doctorType && doctorType !== "All") {
        doctor = await db.User.findOne({
          where: { id: doctorType, roleId: "R2" },
          order: [["createdAt", "DESC"]],
          attributes: {
            exclude: ["password"],
          },
          include: [
            {
              model: db.Allcode,
              as: "positionData",
              attributes: ["valueEn", "valueVi"],
            },
            {
              model: db.Allcode,
              as: "genderData",
              attributes: ["valueEn", "valueVi"],
            },
          ],

          raw: true,
          nest: true,
        });
      }
      resolve({ errCode: 0, errMessage: "get doctor success", data: doctor });
    } catch (error) {
      reject(error);
    }
  });
};

// save data markdown doctor

const saveDataMarkDoc = (dataMarkDoc) => {
  return new Promise(async (resolve, reject) => {
    try {
      console.log(dataMarkDoc);
      if (!dataMarkDoc) {
        resolve({
          errCode: 1,
          errMessage: "Missing pramerte",
        });
      } else {
        await db.Markdown.create({
          contentHTML: dataMarkDoc.contentHTML,
          contentMarkdown: dataMarkDoc.contentMarkdown,
          description: dataMarkDoc.description,
          doctorId: dataMarkDoc.doctorId,
        });

        // update doctor info
        // if (!resDoctorInfo) {
        await db.Doctor_info.create({
          doctorId: dataMarkDoc.doctorId,
          priceId: dataMarkDoc.selectedPrice,
          provinceId: dataMarkDoc.selectedProvince,
          paymentId: dataMarkDoc.selectedPayment,
          addressClinic: dataMarkDoc.addressClinic,
          nameClinic: dataMarkDoc.nameClinic,
          note: dataMarkDoc.note,
        });

        // resolve({
        //   errCode: 0,
        //   errMessage: "UPdate doctor info success!",
        // });
      }
      // else {

      // }

      resolve({
        errCode: 0,
        errMessage: "Success Markdown!",
      });
    } catch (error) {
      reject(error);
      console.log(error);
    }
  });
};

const getDetailDoctor = (idDoctor) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (idDoctor) {
        let resDB = await db.User.findOne({
          where: { id: idDoctor },
          // order: [["createdAt", "DESC"]],
          attributes: {
            exclude: ["password"],
          },
          include: [
            {
              model: db.Markdown,
              attributes: ["description", "contentHTML", "contentMarkdown"],
            },
            {
              model: db.Doctor_info,
              // attributes: ["description", "contentHTML", "contentMarkdown"],
              exclude: ["id", "doctorId"],

              include: [
                {
                  model: db.Allcode,
                  as: "priceData",
                  attributes: ["valueVi", "valueEn"],
                },
                {
                  model: db.Allcode,
                  as: "provinceData",
                  attributes: ["valueVi", "valueEn"],
                },
                {
                  model: db.Allcode,
                  as: "paymentData",
                  attributes: ["valueVi", "valueEn"],
                },
              ],
            },
          ],

          raw: false,
          nest: true,
        });
        // let res = await db.Doctor_info.findOne({
        //   where: { doctorId: idDoctor },
        //   include: [
        //     {
        //       model: db.Allcode,
        //       // attributes: ["description", "contentHTML", "contentMarkdown"],
        //     },
        //   ],

        //   raw: false,
        //   nest: true,
        // });
        // console.log("check doctoer info", res);
        if (resDB && resDB.image) {
          // console.log("check img", resDB.image);

          resDB.image = Buffer.from(resDB.image, "base64").toString("binary");
          resolve({
            errCode: 0,
            errMessage: "get Detail Doctor success!",
            data: resDB,
          });
        }
      }
    } catch (error) {
      console.log("checl rr", error);
      reject(error);
    }
  });
};

const getMarkdownDoctor = (idDoctor) => {
  // console.log("check id", idDoctor);
  return new Promise(async (resolve, reject) => {
    try {
      if (idDoctor) {
        let doctorM = await db.Markdown.findOne({
          where: { id: idDoctor },

          include: [
            {
              model: db.Doctor_info,
              // as: "priceData",
              // attributes: ["valueVi", "valueEn"],
            },
            // {
            //   model: db.Allcode,
            //   as: "provinceData",
            //   attributes: ["valueVi", "valueEn"],
            // },
            // {
            //   model: db.Allcode,
            //   as: "paymentData",
            //   attributes: ["valueVi", "valueEn"],
            // },
          ],

          raw: false,
          nest: true,
        });
        // console.log("check doctor", doctorM);
        if (doctorM) {
          resolve({
            errCode: 0,
            errMessage: "get Markdown doctor success!",
            data: doctorM,
          });
        } else {
          resolve({
            errCode: 2,
            errMessage: "get Markdown doctor success but empty!",
            data: {},
          });
        }
      }
    } catch (error) {
      reject(error);
    }
  });
};
const updateMarkdownDoctor = (doctor) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (doctor) {
        let doctorUpdate = await db.Markdown.findOne({
          where: { doctorId: doctor.doctorId },
          raw: false,
        });
        let doctorUpdated = "";

        let doctorInfoUpdated = "";
        if (doctorUpdate) {
          doctorUpdate.contentHTML = doctor.contentHTML;
          doctorUpdate.contentMarkdown = doctor.contentMarkdown;
          doctorUpdate.description = doctor.description;
          // doctorUpdate.contentHTML = "dsadasda";
          // doctorUpdate.contentMarkdown = "dsadadada";
          // doctorUpdate.description = "dsadasdadasda";
          // the name is still "Jane" in the database

          doctorUpdated = await doctorUpdate.save();
        }
        let resDoctorInfo = await db.Doctor_info.findOne({
          where: { doctorId: doctor.doctorId },
          raw: false,
        });
        if (resDoctorInfo) {
          // resDoctorInfo.doctorId = doctor.doctorId;
          resDoctorInfo.priceId = doctor.selectedPrice;
          resDoctorInfo.provinceId = doctor.selectedProvince;
          resDoctorInfo.paymentId = doctor.selectedPayment;
          resDoctorInfo.addressClinic = doctor.addressClinic;
          resDoctorInfo.nameClinic = doctor.nameClinic;
          resDoctorInfo.note = doctor.note;
          doctorInfoUpdated = await resDoctorInfo.save();
        }

        resolve({
          errCode: 0,
          errMessage: "success doctor Mrark",
          data: {
            doctorUpdated,
            doctorInfoUpdated,
          },
        });
      }
    } catch (error) {
      console.log("check error", error);
      reject(error);
    }
  });
};
const createScheduleDoctor = (dataS) => {
  return new Promise(async (resolve, reject) => {
    try {
      // console.log("check data", dataS);
      let dataSchedule = dataS.data;
      // console.log("data", dataS);
      if (dataSchedule && dataSchedule.length > 0) {
        let res = await db.Schedule.findAll({
          where: {
            doctorId: dataSchedule[0].doctorId,
            date: dataSchedule[0].date,
          },
          attributes: ["date", "timeType", "maxNumber", "doctorId"],
        });
        // console.log("check ", res);
        let data = dataSchedule.map((item) => {
          item.maxNumber = parseInt(maxNumber);
          return item;
        });
        if (res && res.length > 0) {
          res = res.map((item) => {
            item.date = Date.parse(item.date);
            return item;
          });
          // console.log("check 1", data);
          // console.log("check 2", res);
          let dataCompared = _.differenceWith(data, res, (a, b) => {
            return a.date === b.date && a.timeType === b.timeType;
          }); // returns [{x: 1, y: 2}]

          // console.log("check daat", dataCompared);
          await db.Schedule.bulkCreate(dataCompared);
          resolve({
            errCode: 0,
            errMessage: "create schedule success!",
          });
        } else {
          // console.log("check data", data);
          await db.Schedule.bulkCreate(data);
          resolve({
            errCode: 0,
            errMessage: "fisrt create schedule success!",
          });
        }
      } else {
        resolve({
          errCode: -1,
          errMessage: "Missing parameter!",
        });
      }
    } catch (error) {
      console.log("check err", error);
      reject(error);
    }
  });
};
const getDoctorSchedule = (doctorId, date) => {
  return new Promise(async (resolve, reject) => {
    try {
      // console.log("check res", doctorId, date);

      let res = await db.Schedule.findAll({
        where: { doctorId: doctorId, date: date },
        // raw: false,
        // attributes: {
        //   exclude: ["password"],
        // },
        include: [
          {
            model: db.Allcode,
            attributes: ["valueEn", "valueVi", "type"],
          },
          // {
          //   model: db.Allcode,
          //   as: "genderData",
          //   attributes: ["valueEn", "valueVi"],
          // },
        ],

        raw: false,
        nest: true,
      });
      if (res && res.length > 0) {
        // res = res.map(item => {
        //   item.date =
        //   return item
        // })
        resolve({
          data: res,
          errCode: 0,
          errMessage: "get doctor schedule success!",
        });
      } else {
        resolve({
          errCode: -1,
          errMessage: "does not exist doctor!",
          data: [],
        });
      }
      // console.log("check date", date);
      // console.log("check doctorId", doctorId);
      // console.log("check date", res);
    } catch (error) {
      console.log("error from server", error);
      reject(error);
    }
  });
};
module.exports = {
  getTopDoctorHome: getTopDoctorHome,
  getAllDoctor: getAllDoctor,
  saveDataMarkDoc: saveDataMarkDoc,
  getDetailDoctor: getDetailDoctor,
  getMarkdownDoctor: getMarkdownDoctor,
  updateMarkdownDoctor: updateMarkdownDoctor,
  createScheduleDoctor: createScheduleDoctor,
  getDoctorSchedule: getDoctorSchedule,
};
