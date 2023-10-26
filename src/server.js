import express from "express";
import bodyParser from "body-parser";
import configViewEngine from "./config/viewEngine";
import initWebRoute from "./route/web";
import connectDB from "./config/connectDB";
// giup chay process.env
import "dotenv/config";
import cors from "cors";
let app = express();
app.use(cors({ origin: true, credentials: true }));

// config app
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));

configViewEngine(app);
initWebRoute(app);
connectDB();
// lay tham so PORT trong filr env
let port = process.env.PORT || 2001;

app.listen(port, () => {
  console.log("backend nodejs running" + port);
});
