const User = require('../models/').User;
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const sgMail = require('@sendgrid/mail');
const otpGenerator = require('otp-generator');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);
const api401Error = require('../utils/errors/api401Error');
const api404Error = require('../utils/errors/api404Error');
const api400Error = require('../utils/errors/api400Error');
const _ = require('lodash');

//login
exports.login = async (req, res, next) => {
  try {
    let { email, password } = req.body;
    let user = await User.findOne({ where: { email } });
    if (!user) throw new api400Error('Email hoặc mật khẩu không chính xác');

    let isMatch = await bcrypt.compare(password, user.password);
    // console.log(isMatch);
    // if (!isMatch) throw new api400Error('Email hoặc mật khẩu không chính xác');
    // console.log(user);
    let token = await jwt.sign({ userId: user.id, isAdmin: user.isAdmin }, process.env.JWT_KEY, {
      expiresIn: '3 days',
    });
    res.setHeader('authToken', token);

    res.status(200).json({ user: _.omit(user.toJSON(), ['password']), token });
  } catch (error) {
    next(error);
  }
};
//login admin
exports.loginAdmin = async (req, res, next) => {
  try {
    let { email, password } = req.body;
    let user = await User.findOne({ where: { email } });
    if (!user) throw new api400Error('Email hoặc mật khẩu không chính xác');

    let isMatch = await bcrypt.compare(password, user.password);

    // console.log(isMatch);
    // if (!isMatch) throw new api400Error('Email hoặc mật khẩu không chính xác');
    // console.log(user);
    if (!user.isAdmin) {
      throw new api400Error('Bạn không có quyền đăng nhập trang này');
    }
    let token = await jwt.sign({ userId: user.id, isAdmin: user.isAdmin }, process.env.JWT_KEY, {
      expiresIn: '3 days',
    });
    res.setHeader('authToken', token);
    res.status(200).json({ user: _.omit(user.toJSON()), token });
  } catch (error) {
    next(error);
  }
};
//register

exports.register = async (req, res, next) => {
  try {
    let { email, password, username, fullName } = req.body;
    let userNameCheck = await User.findOne({ where: { username } });
    // console.log(userNameCheck);
    if (userNameCheck) {
      throw new api400Error('Username đã được đăng kí');
    }
    let emailCheck = await User.findOne({ where: { email } });
    if (emailCheck) {
      throw new api400Error('Email đã được đăng kí');
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
    res.status(200).json({ user: _.omit(user.toJSON()) });
  } catch (error) {
    next(error);
  }
};

exports.forgotPassword = async (req, res, next) => {
  // #swagger.description = 'Endpoint forgot password and then receive a random password in email .'

  /* #swagger.parameters['reset-password'] = { 
            in: 'body', 
            '@schema': { 
                "required": [ "email"], 
                "properties": { 
                    
                     "email": { 
                        "type": "string", 
                        "maxLength": 250, 
                        "example": "thang@gmail.com" 
                    } 
                     
                } 
            } 
        } */
  //#swagger.responses[401] ={description: 'Unauthorized' }
  //#swagger.responses[400] ={description: 'Bad Request' }
  try {
    const { email } = req.body;
    console.log(email, req.body);
    const user = await User.findOne({ where: { email } });
    console.log('user', user);
    let arr = [];
    if (!user) {
      const err = new Error('Dữ liệu nhập vào không hợp lệ');
      let param = {
        msg: 'Email không hợp lệ, vui lòng nhập lại',
        param: 'email',
      };
      err.data = [...arr, param];
      err.statusCode = 422;
      throw err;
    }
    const OTP = otpGenerator.generate(6, {
      digits: true,

      specialChars: false,
    });
    // const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
    //   expiresIn: "20m",
    // });
    const data = {
      from: 'thang00lata@gmail.com',
      to: req.body.email,
      subject: 'Đổi mật khẩu!!',
      html: `<h2>Mật khẩu mới của bạn là: ${OTP}</h2>`,
      // html: `<h2>Vui lòng click link ở dưới để đổi mật khẩu!</h2>
      // <p><a href=''>${process.env.CLIENT_URL}/reset-password/${token}</a></p>`,
    };
    sgMail
      .send(data)
      .then(() => {
        console.log('Email sent');
      })
      .catch((error) => {
        try {
          console.log(error);
          const err = new Error(error.message);
          err.statusCode = 400;
          throw err;
        } catch (error) {
          next(error);
        }
      });
    hashPass = await bcrypt.hash(OTP, 8);
    await User.update({ password: hashPass }, { where: { id: user.id } });

    res.json({ message: 'Mật khẩu mới đã gửi tới email của bạn' });
  } catch (error) {
    next(error);
  }
};
