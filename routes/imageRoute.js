const express = require("express");
const imageRoute = express.Router();

//import commonjs Module
// import hàm getImage từ thư mục controller+
const {
  getAllImage,
  findImageByName,
  findImageDetailByImgId,
  getImageCreateByUserId,
  deleteImageByImageId,
} = require("../models/imageController");
const { verifyToken } = require("../utils/jwtoken");

// tạo API phương thức GET
imageRoute.get("/getImage", verifyToken, getAllImage);
imageRoute.get("/findImage/:name", verifyToken, findImageByName);
imageRoute.get(
  "/findImageDetailByImgId/:id",
  verifyToken,
  findImageDetailByImgId
);
imageRoute.get(
  "/getImageCreateByUserId/:userId",
  verifyToken,
  getImageCreateByUserId
);
imageRoute.delete(
  "/deleteImageByImageId/:imgId",
  verifyToken,
  deleteImageByImageId
);
module.exports = imageRoute;
