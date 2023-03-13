const { PrismaClient } = require("@prisma/client");
const model = new PrismaClient();
const bcrypt = require("bcrypt");
const { createToken } = require("../utils/jwtoken");
const { successCode, failCode, errorCode } = require("../config/respone");
let fs = require("fs");
let util = require("util");
const readFileAsync = util.promisify(fs.readFile);
const unlinkAsync = util.promisify(fs.unlink);

const signUp = async (req, res) => {
  try {
    const { email, password, name, age, avatar } = req.body;

    if (!email || !password) {
      return failCode(
        res,
        { email, password },
        "Please provide a valid email address and password"
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newModel = {
      email,
      password: hashedPassword,
      name,
      age,
      avatar,
    };

    const user = await model.users.create({ data: newModel });

    if (user) {
      successCode(res, newModel, "Sign Up successful");
    }
  } catch (err) {
    console.error(err);
    if (err.code === "P2002") {
      return failCode(res, "Invalid email");
    }
    errorCode(res, "Backend Error");
  }
};

const login = async (req, res) => {
  try {
    let { email, password } = req.body;

    // truy cập database get ra đúng email và password
    // kiểm tra 2 lần : check email mới check password

    let checkUser = await model.users.findUnique({
      where: { email },
    });

    if (checkUser) {
      // Check password

      let checkPassword = await bcrypt.compare(password, checkUser.password);
      // Nếu password giống nhau thì => true
      if (checkPassword) {
        // Tạo token cho người dùng
        delete checkUser.avatar;
        let token = createToken(checkUser);
        successCode(res, token, "Login success");
      } else {
        res.status(404).send("Password does not match");
      }
    }
  } catch (error) {
    errorCode(res, "BackEnd Error");
  }
};

const getUserProfile = async (req, res) => {
  try {
    let { id } = req.params;

    let dataProfile = await model.users.findUnique({
      where: { id: +id },
    });

    successCode(res, dataProfile, "Get User Profile Success");
  } catch (error) {
    errorCode(res, "BackEnd Error");
  }
};

const updateUserProfile = async (req, res) => {
  try {
    let { id, email, password, name, age } = req.body;

    let findUserProfile = await model.users.findUnique({
      where: { id: +id },
    });

    if (!findUserProfile) return res.send("User profile is not exist");

    const hashPassword = await bcrypt.hash(password, 10);

    let dataUpdate = {
      email,
      password: hashPassword,
      name,
      age,
    };

    let updateDataProfile = await model.users.update({
      where: { id: +id },
      data: dataUpdate,
    });

    successCode(res, updateDataProfile, "User profile update sucessfully");
  } catch (error) {
    errorCode(res, "Backend error");
  }
};

const updateUserAvatar = async (req, res) => {
  try {
    let { userId } = req.params;
    console.log(req.file);
    const fileData = await readFileAsync(
      process.cwd() + "/public/img/" + req.file.filename
    );
    const fileName = `data:${req.file.mimetype};base64,${Buffer.from(
      fileData
    ).toString("base64")}`;

    // delete file server
    await unlinkAsync(process.cwd() + "/public/img/" + req.file.filename);

    const updateUser = await model.users.update({
      where: { id: +userId },
      data: { avatar: fileName },
    });
    successCode(res, updateUser, "Avatar updated successfully");
  } catch (error) {
    if (error.code === "P2025") {
      return res.send("User not found");
    }
  }
};

module.exports = {
  signUp,
  login,
  getUserProfile,
  updateUserProfile,
  updateUserAvatar,
};
