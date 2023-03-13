const express = require("express");
const {
  checkImageSaved,
  getSaveImageByUserId,
} = require("../models/saveImageController");
const saveImageRoute = express.Router();

//import commonjs Module
// import hàm getImage từ thư mục controller+

const { verifyToken } = require("../utils/jwtoken");

// tạo API phương thức GET
saveImageRoute.get("/checkImageSaved/:imgId", verifyToken, checkImageSaved);
saveImageRoute.get(
  "/getSaveImageByUserId/:userId",
  verifyToken,
  getSaveImageByUserId
);

module.exports = saveImageRoute;
