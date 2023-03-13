const express = require("express");
const { diskStorage } = require("multer");
const multer = require("multer");
const userRoute = express.Router();

//import commonjs Module
// import hàm getUser từ thư mục controller+
const {
  signUp,
  login,
  getUserProfile,
  updateUserProfile,
  updateUserAvatar,
} = require("../models/userController");
const { verifyToken } = require("../utils/jwtoken");

// tạo API phương thức POST
userRoute.post("/signUp", signUp);
userRoute.post("/login", login);
userRoute.get("/getUserProfile/:id", verifyToken, getUserProfile);
userRoute.put("/updateProfile", verifyToken, updateUserProfile);

// const upload = multer({ dest: `${process.cwd()}/public/img` });
const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, `${process.cwd()}/public/img`);
  },
  filename: (req, file, callback) => {
    const d = new Date();
    const newName = d.getTime() + "_" + file.originalname;
    callback(null, newName);
  },
});

const upload = multer({ storage });

userRoute.post(
  "/uploadUserAvatar/:userId",
  upload.single("file"),
  verifyToken,
  updateUserAvatar
);

module.exports = userRoute;
