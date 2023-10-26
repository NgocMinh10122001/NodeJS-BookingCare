import { where } from "sequelize";
import db from "../models/index";
var bcrypt = require("bcryptjs");
const salt = bcrypt.genSaltSync(10);
let createNewUser = async (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      let hashPasswordFromBcrypt = await hashUserPassword(data.password);
      await db.User.create({
        email: data.email,
        password: hashPasswordFromBcrypt,
        firstName: data.firstName,
        lastName: data.lastName,
        address: data.address,
        phonenumber: data.phonenumber,
        gender: data.gender === "1" ? true : false,
        //   image: DataTypes.STRING,
        roleId: data.roleId,
        //   positionId: DataTypes.STRING,
      });
      resolve("ok create success!");
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

let getAllUser = () => {
  return new Promise((resolve, reject) => {
    try {
      let users = db.User.findAll({ raw: true });
      resolve(users);
    } catch (e) {
      reject(e);
    }
  });
};

let getUser = (idUser) => {
  return new Promise(async (resolve, reject) => {
    try {
      let user = await db.User.findByPk(idUser, { raw: true });
      if (user) {
        resolve(user);
      } else {
        resolve({});
      }
    } catch (e) {
      reject(e);
    }
  });
};
let updateUser = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      let id = data.id;
      let newUser = await db.User.findOne({ where: id });
      if (newUser) {
        await newUser.update({
          email: data.email,
          password: data.password,
          firstName: data.firstName,
          lastName: data.lastName,
          address: data.address,
          gender: data.gender,
          roleId: data.roleId,
          phonenumber: data.phonenumber,
        });
        newUser.save();
        // let allUsers = await db.User.findAll();
        // resolve(allUsers);
        resolve(newUser);
      } else {
        console.log("loi r be oi");
      }
    } catch (e) {
      reject(e);
    }
  });
};
let deleteUser = (idDelete) => {
  return new Promise(async (resolve, reject) => {
    try {
      let userD = await db.User.findByPk(idDelete);
      if (userD) {
        await userD.destroy();
      }
      resolve();
    } catch (e) {
      reject(e);
    }
  });
};
module.exports = {
  createNewUser: createNewUser,
  getAllUser: getAllUser,
  getUser: getUser,
  updateUser: updateUser,
  deleteUser: deleteUser,
};
