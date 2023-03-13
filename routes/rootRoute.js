const express = require("express");
const rootRoute = express.Router();

const userRoute = require("./userRoute");
const imageRoute = require("./imageRoute");
const commentRoute = require("./commentRoute");
const saveImageRoute = require("./saveImageRoute");

// Sử dụng middleware của express
rootRoute.use("/user", userRoute);
rootRoute.use("/image", imageRoute);
rootRoute.use("/comment", commentRoute);
rootRoute.use("/saveImage", saveImageRoute);
module.exports = rootRoute;
