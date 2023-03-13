const { PrismaClient } = require("@prisma/client");
const model = new PrismaClient();
const bcrypt = require("bcrypt");
const { successCode, errorCode, failCode } = require("../config/respone");

const getCommentById = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await model.comment.findMany({
      select: {
        user_id: true,
        image_id: true,
        comment_date: true,
        content: true,
        users: {
          select: {
            email: true,
          },
        },
      },
      where: {
        image_id: +id,
        users: {
          id: {
            equals: model.comment.user_id,
          },
        },
      },
    });

    successCode(res, result, "Get comment successfully");
  } catch (error) {}
};

const postComment = async (req, res) => {
  try {
    const { user_id, image_id, comment_date, content } = req.body;

    // const nDate = new Date().toLocaleString("en-US", {
    //   timeZone: "Asia/Bangkok",
    // });

    const now = new Date();
    now.setHours(now.getHours() + 7);

    const user = await model.users.findUnique({
      where: {
        id: user_id,
      },
    });

    if (!user) {
      return failCode(res, user, "User not found");
    }

    const image = await model.image.findUnique({
      where: {
        id: image_id,
      },
    });

    if (!image) {
      return failCode(res, image, "Image not found");
    }

    let dataUpload = await model.comment.create({
      data: {
        user_id,
        image_id,
        comment_date: now,
        content,
      },
    });

    console.log(dataUpload);
  } catch (error) {}
};

module.exports = { getCommentById, postComment };
