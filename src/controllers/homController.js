import db from "../models/index";
import CRUDservice from "../services/CRUDservice";
let getHomePage = async (req, res) => {
  try {
    let data = await db.User.findAll();
    // console.log("------------");
    // console.log(data);
    // console.log("------------");

    return res.render("home-page.ejs", { data: JSON.stringify(data) });
  } catch (e) {
    console.log(e);
  }
};

let getAboutPage = (req, res) => {
  return res.render("about.ejs");
};

let getCRUD = (req, res) => {
  return res.render("crud.ejs");
};

let postCRUD = async (req, res) => {
  let message = await CRUDservice.createNewUser(req.body);
  console.log(message);
  return res.redirect("/get-crud");
};

let getAllUser = async (req, res) => {
  let dataUsers = await CRUDservice.getAllUser();
  // console.log(dataUsers);
  return res.render("displayCRUD.ejs", { dataUsers: dataUsers });
};

let EditCRUD = async (req, res) => {
  let id = req.params.id;
  // console.log(id);
  let dataUser = await CRUDservice.getUser(id);
  console.log(dataUser);
  return res.render("edit.ejs", { dataUser: dataUser });
};
let updateUser = async (req, res) => {
  let data = req.body;
  // let allUsers =
  await CRUDservice.updateUser(data);
  // return res.render("displayCRUD.ejs", { dataUsers: allUsers });
  return res.redirect("/get-crud");
};

let deleteUser = async (req, res) => {
  let id = req.params.idDelete;
  // let id = req.query.id;
  if (id) {
    await CRUDservice.deleteUser(id);
    return res.redirect("/get-crud");
  } else {
    return res.send("no usser");
  }
  // console.log(id);

  // return res.send("dellete");
};
module.exports = {
  getHomePage: getHomePage,
  getAboutPage: getAboutPage,
  getCRUD: getCRUD,
  postCRUD: postCRUD,
  getAllUser: getAllUser,
  EditCRUD: EditCRUD,
  updateUser: updateUser,
  deleteUser: deleteUser,
};
