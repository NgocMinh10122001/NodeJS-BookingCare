import patientService from "../services/patientService";

const postBookAppointment = async (req, res) => {
  try {
    let info = req.body.data;
    console.log("chcek in fo", info);
    let resService = await patientService.handleBookAppointment(info);
    return res.status(200).json(resService);
  } catch (error) {
    return res.status(200).json({
      errCode: -1,
      errMessage: "Error from server!",
    });
  }
};

const updateStatusBooking = async (req, res) => {
  try {
    // console.log("check body fe", req.body);
    let token = req.body.token;
    let doctorId = req.body.doctorId;
    let resService = await patientService.updateStatusBooking(token, doctorId);
    return res.status(200).json(resService);
  } catch (error) {
    return res.status(200).json({
      errCode: -1,
      errMessage: "error from server!",
    });
  }
};

module.exports = {
  postBookAppointment,
  updateStatusBooking,
};
