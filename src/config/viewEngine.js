import express from "express";
let configViewEngine = (app) => {
  // luu anh len server -> express.static de chi ro chi duoc lay anh tu file nay (link nay)
  app.use(express.static("./src/public"));
  app.set("view engine", "ejs");
  app.set("views", "./src/views");
};

module.exports = configViewEngine;
