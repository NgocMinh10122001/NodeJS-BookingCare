import doctorService from "../services/doctorService";
const getTopDoctorHome = async (req, res) => {
  let limit = parseInt(req.query.limit);
  // console.log("check limit", limit);
  if (!limit) limit = 10;
  try {
    // console.log("check 2", limit);
    let docTopHOme = await doctorService.getTopDoctorHome(limit);
    return res.status(200).json(docTopHOme);
  } catch (error) {
    return res.status(200).json({
      errCode: -1,
      errMessage: "Error from server!",
    });
  }
};

const getAllDoctor = async (req, res) => {
  let doctorType = req.query.doctorType;
  // console.log("check type", doctorType);
  try {
    let doctors = await doctorService.getAllDoctor(doctorType);
    // console.log("check doctor", doctors);

    return res.status(200).json(doctors);
  } catch (error) {
    return res.status(200).json({
      errCode: -1,
      errMessage: "Error from server!",
    });
  }
};

// save markdown doctor
const saveMarkdownDoctor = async (req, res) => {
  let dataMarkDoc = req.body.dataMarkDoc;
  // console.log("check mark", dataMarkDoc);
  try {
    if (dataMarkDoc) {
      let resDB = await doctorService.saveDataMarkDoc(dataMarkDoc);
      return res.status(200).json(resDB);
    }
  } catch (error) {
    return res.status(200).json({
      errCode: -1,
      errMessage: "Error from server!",
    });
  }
};

const detailDoctor = async (req, res) => {
  let idDoctor = req.query.idDoctor;
  // console.log("check id", idDoctor);
  try {
    if (idDoctor) {
      let detailDoctor = await doctorService.getDetailDoctor(idDoctor);
      // console.log("check 1", detailDoctor);
      return res.status(200).json(detailDoctor);
    } else {
      return res.status(200).json({
        errCode: 3,
        errMessage: "Missing parameter",
      });
    }
  } catch (error) {
    // console.log("check", error);
    return res.status(200).json({
      errCode: -1,
      errMessage: "Error from server!",
    });
  }
};

const getMarkdownDoctor = async (req, res) => {
  try {
    let doctorId = req.query.doctorId;
    if (doctorId) {
      let doctorM = await doctorService.getMarkdownDoctor(doctorId);
      // console.log("doctor id", doctorId);
      if (doctorM) {
        return res.status(200).json(doctorM);
      }
    }
  } catch (error) {
    console.log(error);
    return res.status(200).json({
      errCode: 1,
      errMessage: "Error from server!",
    });
  }
};

const updateMarkdownDoctor = async (req, res) => {
  try {
    let doctor = req.body.doctor;
    // console.log("check doctor", doctor);
    if (doctor) {
      let doctorUpdated = await doctorService.updateMarkdownDoctor(doctor);
      if (doctorUpdated) {
        return res.status(200).json(doctorUpdated);
      }
    } else {
      return res.status(200).json({
        errCode: 3,
        errMessage: "Missing parameter !",
      });
    }
  } catch (error) {
    return res.status(200).json({
      errCode: 1,
      errMessage: "Error from server!",
    });
  }
};

const createScheduleDoctor = async (req, res) => {
  let scheduleDoctor = req.body.data;
  // console.log("check data", scheduleDoctor);

  try {
    let resService = await doctorService.createScheduleDoctor(scheduleDoctor);
    return res.status(200).json(resService);
  } catch (error) {
    // console.log("chekc err", error);
    return res.status(200).json({
      errCode: 1,
      errMessage: "Error form server!",
    });
  }
};
const getDoctorSchedule = async (req, res) => {
  try {
    let data = await doctorService.getDoctorSchedule(
      req.query.doctorId,
      req.query.date
    );
    return res.status(200).json(data);
  } catch (error) {
    return res.status(200).json({
      errCode: 1,
      errMessage: "Error from server!",
    });
  }
};
module.exports = {
  getTopDoctorHome: getTopDoctorHome,
  getAllDoctor: getAllDoctor,
  saveMarkdownDoctor: saveMarkdownDoctor,
  detailDoctor: detailDoctor,
  getMarkdownDoctor: getMarkdownDoctor,
  updateMarkdownDoctor: updateMarkdownDoctor,
  createScheduleDoctor: createScheduleDoctor,
  getDoctorSchedule: getDoctorSchedule,
};
