import userService from "../services/userService";

let handleLogin = async (req, res) => {
  let email = req.body.email;
  let password = req.body.password;
  if (!email || !password) {
    return res.status(500).json({
      errCode: 1,
      message: "Missing input parameter!",
    });
  }
  let user = await userService.handleUserLogin(email, password);
  return res.status(200).json({
    errCode: user.errorCode,
    message: user.errorMessage,
    user: user.user ? user.user : {},
  });
};

let handleGetAllUsers = async (req, res) => {
  let id = req.query.id;
  if (!id) {
    return res.status(200).json({
      errCode: 1,
      message: "Missing required parameters",
      users: [],
    });
  }
  let users = await userService.handleGetAllUsers(id);
  // console.log(users);
  return res.status(200).json({
    errCode: 0,
    message: "ok",
    users: users,
  });
};

let handleCreateNewUser = async (req, res) => {
  try {
    let message = await userService.CreateNewUser(req.body);
    return res.status(200).json(message);
  } catch (error) {
    console.log(error);
  }
  // console.log("check req", req.body);
  // console.log("check message", message);
};
let handleDeleteUser = async (req, res) => {
  let id = req.body.userId;
  if (!id) {
    return res.status(200).json({
      errCode: 1,
      message: "Id is not exists,lets retry again!",
    });
  }
  let message = await userService.DeleteUser(id);
  return res.status(200).json(message);
};
let handleUpdateUser = async (req, res) => {
  let data = req.body;
  // console.log(data);
  let message = await userService.UpdateUser(data);
  console.log("check data", data);
  return res.status(200).json(message);
};

let getAllCode = async (req, res) => {
  try {
    setTimeout(async () => {
      let data = await userService.getAllCodeService(req.query.type);
      return res.status(200).json(data);
    }, 0);
  } catch (e) {
    console.log("Get all code err: ", e);
    return res.status(200).json({
      errCode: -1,
      errMessage: "Err from server!",
    });
  }
};

const getExtraDoctorInfo = async (req, res) => {
  try {
    let doctorId = req.query.doctorId;
    let resService = await userService.getExtraDoctorInfo(doctorId);
    return res.status(200).json(resService);
  } catch (error) {
    return res.status(200).json({
      errCode: 1,
      errMessage: "Error from server!",
    });
  }
};

const getProfileDoctorById = async (req, res) => {
  try {
    let doctorId = req.query.doctorId;
    let resService = await userService.getProfileDoctorById(doctorId);
    return res.status(200).json(resService);
  } catch (error) {
    return res.status(200).json({
      errCode: -1,
      errMessage: "Error from server!",
    });
  }
};
module.exports = {
  handleLogin: handleLogin,
  handleGetAllUsers: handleGetAllUsers,
  handleCreateNewUser: handleCreateNewUser,
  handleUpdateUser: handleUpdateUser,
  handleDeleteUser: handleDeleteUser,
  getAllCode: getAllCode,
  getExtraDoctorInfo: getExtraDoctorInfo,
  getProfileDoctorById: getProfileDoctorById,
};
