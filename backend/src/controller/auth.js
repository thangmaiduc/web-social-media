const User = require("../models/").User;
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const api401Error = require("../utils/errors/api401Error");
const api404Error = require("../utils/errors/api404Error");
const api400Error = require("../utils/errors/api400Error");
//login
exports.login = async (req, res, next) => {
  try {
    let { email, password } = req.body;
    let user = await User.findOne({ where: { email } });
    if (!user) throw new api400Error("Email hoặc mật khẩu không chính xác");

    let isMatch = await bcrypt.compare(password, user.password);
    console.log(isMatch);
    if (!isMatch) throw new api400Error("Email hoặc mật khẩu không chính xác");
    console.log(user);
    let token = await jwt.sign(
      { userId: user.id, isAdmin: user.isAdmin },
      process.env.JWT_KEY,
      {
        expiresIn: "3 days",
      }
    );
    res.setHeader("authToken", token);
    res.status(200).json({ user, token });
  } catch (error) {
    next(error);
  }
};
//register

exports.register = async (req, res, next) => {
  try {
    let { email, password, username, fullName } = req.body;
    let userNameCheck = await User.findOne({ where: { username } });
    console.log(userNameCheck);
    if (userNameCheck) {
      throw new api400Error("Username đã được đăng kí");
    }
    let emailCheck = await User.findOne({ where: { email } });
    if (emailCheck) {
      throw new api400Error("Email đã được đăng kí");
    }
    const salt = await bcrypt.genSalt(10);
    let hasedPassword = await bcrypt.hash(password, salt);
    let newUser = {
      username,
      fullName,
      email,
      password: hasedPassword,
    };
    let user = await User.create(newUser);
    await user.save();
    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};
