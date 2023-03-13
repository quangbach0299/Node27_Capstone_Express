const { PrismaClient } = require("@prisma/client");
const model = new PrismaClient();
const bcrypt = require("bcrypt");
const { successCode, errorCode, failCode } = require("../config/respone");

const checkImageSaved = async (req, res) => {
  try {
    const { imgId } = await req.params;

    const image = await model.image_save.findUnique({
      where: {
        image_id: +imgId,
      },
      include: {
        users: {
          select: {
            email: true,
          },
        },
      },
    });

    if (!image) {
      return failCode(res, image, "Image not saved");
    }
    successCode(res, image, "Image is saved");
  } catch (error) {
    errorCode(res, "Backend Error");
  }
};

const getSaveImageByUserId = async (req, res) => {
  try {
    const { userId } = req.params;

    const image = await model.image_save.findMany({
      where: {
        user_id: +userId,
      },
      include: {
        users: {
          select: { email: true },
        },
      },
    });

    res.send(image);
  } catch (error) {
    errorCode(res, "Backend Error");
  }
};

module.exports = { checkImageSaved, getSaveImageByUserId };
