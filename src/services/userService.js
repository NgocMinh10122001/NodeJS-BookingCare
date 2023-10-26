import axios from "axios";
import { includes, reject } from "lodash";
import { where } from "sequelize";
import db from "../models/index";
var bcrypt = require("bcryptjs");
const salt = bcrypt.genSaltSync(10);
// var hash = bcrypt.hashSync("B4c0//", salt);
let handleUserLogin = (email, password) => {
  return new Promise(async (resolve, reject) => {
    try {
      let userData = {};
      let isExist = await checkUserEmail(email);
      if (isExist) {
        // user already exits

        let user = await db.User.findOne({
          attributes: ["email", "password", "roleId", "firstName", "lastName"],
          where: { email: email },
          raw: true,
        });
        // console.log(user);
        // console.log(user);
        if (user) {
          // compare password
          //   let hashPassWord = bcrypt.hashSync(password, salt);
          //   console.log(hashPassWord);
          let check = bcrypt.compareSync(password, user.password);
          console.log(user.password);
          console.log(check);
          if (check) {
            userData.errorCode = 0;
            userData.errorMessage = "Ok";
            delete user.password;
            userData.user = user;
          } // false
          else {
            userData.errorCode = 3;
            userData.errorMessage = "Wrong password!";
          }
        } else {
          userData.errorCode = 2;
          userData.errorMessage = "User's not found!";
        }
      } else {
        // return error
        userData.errorCode = 1;
        userData.errorMessage =
          "Your's email ins't exits in your system. Plz try other email!";
      }
      resolve(userData);
    } catch (e) {
      reject(e);
    }
  });
};

let checkUserEmail = (userEmail) => {
  return new Promise(async (resolve, reject) => {
    try {
      let user = await db.User.findOne({ where: { email: userEmail } });
      if (user) {
        resolve(true);
      }
      resolve(false);
    } catch (e) {
      reject(e);
    }
  });
};

let handleGetAllUsers = (userId) => {
  return new Promise(async (resolve, reject) => {
    try {
      let user = "";
      if (userId === "All") {
        user = await db.User.findAll({
          attributes: { exclude: ["password"] },
          raw: true,
        });
      }
      if (userId && userId !== "All") {
        user = await db.User.findOne({
          where: { id: userId },
          attributes: { exclude: ["password"] },
          raw: true,
        });
      }
      resolve(user);
    } catch (e) {
      reject(e);
    }
  });
};

let hashUserPassword = (password) => {
  return new Promise(async (resolve, reject) => {
    try {
      let hashPassword = await bcrypt.hashSync(password, salt);
      resolve(hashPassword);
    } catch (e) {
      reject(e);
    }
  });
};

let CreateNewUser = (data) => {
  return new Promise(async (resolve, reject) => {
    // console.log("check data", data);
    try {
      let check = await checkUserEmail(data.email);
      if (check) {
        resolve({
          errCode: 1,
          message: "Email already exists, plz try again!",
        });
      } else {
        let hashPasswordFromBcrypt = await hashUserPassword(data.password);
        await db.User.create({
          email: data.email,
          password: hashPasswordFromBcrypt,
          firstName: data.firstName,
          lastName: data.lastName,
          address: data.address,
          phonenumber: data.phonenumber,
          gender: data.gender,
          image: data.avatar,
          roleId: data.roleId,
          positionId: data.positionId,
          //   positionId: DataTypes.STRING,
        });
        resolve({
          errCode: 0,
          message: "Ok",
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};

let DeleteUser = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      await db.User.destroy({ where: { id } });
      resolve({
        errCode: 0,
        message: "Deleted",
      });
    } catch (e) {
      reject(e);
    }
  });
};

let UpdateUser = (data) => {
  // console.log("check data", data);
  return new Promise(async (resolve, reject) => {
    try {
      let id = data.id;
      let newUser = await db.User.findOne({ where: id, raw: false });
      let Image = data.avatar;
      if (newUser) {
        // if(data.avatar)
        await newUser.update({
          email: data.email,
          // password: data.password,
          firstName: data.firstName,
          lastName: data.lastName,
          address: data.address,
          gender: data.gender,
          roleId: data.roleId,
          phonenumber: data.phonenumber,
          positionId: data.positionId,
        });
        if (Image) {
          newUser.image = Image;
        }
        newUser.save();
        // let allUsers = await db.User.findAll();
        // resolve(allUsers);
        resolve({
          errCode: 0,
          message: "Ok",
        });
      } else {
        resolve({
          errCode: 1,
          message: "Create User Failure, try again!",
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};
let getAllCodeService = (typeInput) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!typeInput) {
        resolve({
          errCode: 1,
          message: "Missing requied parameter!",
        });
      } else {
        let data = await db.Allcode.findAll({
          where: {
            type: typeInput,
          },
        });

        resolve({
          data: data,
          errCode: 0,
          message: "get every thing in Allcode success!",
        });
      }
      // else {
      //   resolve({
      //     errCode: 1,
      //     message: "get Allcode from server failure!",
      //   });
      // }
    } catch (e) {
      console.log(e);
      reject(e);
    }
  });
};
const getExtraDoctorInfo = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (id) {
        let res = await db.Doctor_info.findOne({
          where: { doctorId: id },
          exclude: ["doctorId", "id"],
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
          raw: false,
          nest: true,
        });
        if (res) {
          resolve({
            errCode: 0,
            errorMessage: "get Extra doctor success!",
            data: res,
          });
        } else {
          resolve({
            errCode: -1,
            errorMessage: "get Extra doctor failed!",
            data: [],
          });
        }
      }
    } catch (error) {
      console.log("check error", error);
      reject(error);
    }
  });
};
const getProfileDoctorById = (id) => {
  // console.log("chcek id", id);
  return new Promise(async (resolve, reject) => {
    try {
      if (!id) {
        resolve({
          errCode: 1,
          errMessage: "does exist parameter!",
        });
      } else {
        let res = await db.User.findOne({
          where: { id: id },
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
        if (res) {
          res.image = Buffer.from(res.image, "base64").toString("binary");
          resolve({
            errCode: 0,
            errMessage: "get profile doctor success!",
            data: res,
          });
        } else {
          resolve({
            errCode: 2,
            errMessage: "get profile doctor failure!",
            data: [],
          });
        }
      }
    } catch (error) {
      console.log("check err", error);
      reject(error);
    }
  });
};
module.exports = {
  handleUserLogin: handleUserLogin,
  handleGetAllUsers: handleGetAllUsers,
  CreateNewUser: CreateNewUser,
  DeleteUser: DeleteUser,
  UpdateUser: UpdateUser,
  getAllCodeService: getAllCodeService,
  getExtraDoctorInfo: getExtraDoctorInfo,
  getProfileDoctorById: getProfileDoctorById,
  // getAllUserFromService = (data) => {
  //   return axios.post("/api/getAllUser", data)

  // }
};
