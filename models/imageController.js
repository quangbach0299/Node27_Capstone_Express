const { PrismaClient } = require("@prisma/client");
const model = new PrismaClient();
const bcrypt = require("bcrypt");
const { successCode, errorCode, failCode } = require("../config/respone");

const getAllImage = async (req, res) => {
  try {
    let data = await model.image.findMany();
    successCode(res, data, "Get Data Success");
  } catch (error) {
    errorCode(error, "BackEnd Error");
  }
};

const findImageByName = async (req, res) => {
  try {
    const { name } = await req.params;

    const dataFind = await model.image.findMany({
      where: {
        image_name: { contains: name },
      },
    });

    successCode(res, dataFind, "");
  } catch (error) {
    failCode(error, "BackEnd Error");
  }
};

const findImageDetailByImgId = async (req, res) => {
  try {
    const { id } = await req.params;

    const image = await model.image.findUnique({
      where: {
        id: +id,
      },
      include: {
        users: true,
      },
    });
    delete image.users.id;

    successCode(res, image, "Get image details successfully");
  } catch (error) {
    errorCode(res, "BackEnd Error");
  }
};

const getImageCreateByUserId = async (req, res) => {
  try {
    const { userId } = req.params;

    const image = await model.image.findMany({
      where: {
        user_id: +userId,
      },
      include: {
        users: {
          select: { email: true },
        },
      },
    });

    if (image.length !== 0) {
      successCode(res, image, "Get image create by user successfully");
    } else {
      failCode(res, image, "No image found for the given user ID");
    }
  } catch (error) {
    errorCode(res, "Backend Error");
  }
};

const deleteImageByImageId = async (req, res) => {
  try {
    const { imgId } = req.params;
    await Promise.all([
      model.image_save.delete({
        where: {
          image_id: +imgId,
        },
      }),
      model.comment.deleteMany({
        where: {
          image_id: +imgId,
        },
      }),
      model.image.delete({
        where: {
          id: +imgId,
        },
      }),
    ]);
    successCode(res, "Xóa hình ảnh thành công");
  } catch (error) {
    console.log(error);
    if (error.code === "P2025") res.send("Picture does not exist");
  }
};

module.exports = {
  getAllImage,
  findImageByName,
  findImageDetailByImgId,
  getImageCreateByUserId,
  deleteImageByImageId,
};
