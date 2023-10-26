import express from "express";
import homController from "../controllers/homController";
import userController from "../controllers/userController";
import doctorControler from "../controllers/doctorController";
import patientController from "../controllers/patientController";
let router = express.Router();

const initWebRoute = (app) => {
  router.get("/", homController.getHomePage);
  router.get("/about", homController.getAboutPage);
  router.get("/crud", homController.getCRUD);
  router.post("/post-crud", homController.postCRUD);
  router.get("/get-crud", homController.getAllUser);
  router.get("/edit-crud/:id", homController.EditCRUD);
  router.post("/update-user", homController.updateUser);
  router.get("/delete-crud/:idDelete", homController.deleteUser);
  router.post("/api/login", userController.handleLogin);
  router.get("/api/get-all-users", userController.handleGetAllUsers);
  router.post("/api/create-new-user", userController.handleCreateNewUser);
  router.put("/api/update-new-user", userController.handleUpdateUser);
  router.delete("/api/delete-new-user", userController.handleDeleteUser);

  router.get("/api/top-doctor-home", doctorControler.getTopDoctorHome);
  router.get("/api/get-all-doctor", doctorControler.getAllDoctor);
  router.post("/api/save-markdown-doctor", doctorControler.saveMarkdownDoctor);
  router.get("/api/detail-doctor", doctorControler.detailDoctor);
  router.get("/api/get-markdown-doctor", doctorControler.getMarkdownDoctor);
  router.put(
    "/api/update-markdown-doctor",
    doctorControler.updateMarkdownDoctor
  );
  router.post(
    "/api/create-schedule-doctor",
    doctorControler.createScheduleDoctor
  );

  router.get("/api/get-doctor-schedule", doctorControler.getDoctorSchedule);
  router.get("/api/get-extra-doctor-info", userController.getExtraDoctorInfo);
  router.get(
    "/api/get-profile-doctor-by-id",
    userController.getProfileDoctorById
  );

  router.post(
    "/api/patient-book-appointment",
    patientController.postBookAppointment
  );
  router.put(
    "/api/confirm-update-booking-success",
    patientController.updateStatusBooking
  );

  router.get("/api/allcode", userController.getAllCode);

  // router.get("/delete-crud", homController.deleteUser);

  return app.use("/", router);
};

// export default initWebRoute;
module.exports = initWebRoute;
