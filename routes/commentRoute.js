const express = require("express");
const commentRoute = express.Router();

//import commonjs Module
// import hàm getUser từ thư mục controller+

// tạo API phương thức POST
const { getCommentById, postComment } = require("../models/commentController");
const { verifyToken } = require("../utils/jwtoken");

commentRoute.get("/getCommentById/:id", verifyToken, getCommentById);
commentRoute.post("/postComment", verifyToken, postComment);
module.exports = commentRoute;
