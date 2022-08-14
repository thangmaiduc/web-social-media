const jwt = require('jsonwebtoken');
const User = require('../models').User;
const api401Error = require('../utils/errors/api401Error');

const authUser = async (req, res, next) => {
  try {
    const token =
      req.header('Authorization') &&
      req.header('Authorization').replace('Bearer ', '');
    if (!token) {
      const error = new Error('Bạn chưa đăng nhập, vui lòng đăng nhập');
      error.statusCode = 417;
    }
    const decode = jwt.verify(token, process.env.JWT_KEY);
    // console.log(decode);
    const user = await User.findOne({ where: { id: decode.userId } });
    if (!user) {
      const error = new Error('Tài khoản không tồn tài');
      error.statusCode = 401;
    }
    req.user = user;

    next();
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 417;
      error.message = 'Hết phiên đăng nhập, vui lòng đăng nhập lại';
    }
    next(error);
  }
};
function authAdmin(req, res, next) {
  console.log(req.user);
    if (req.user.isAdmin !== true) {
      console.log('you are not admin', req.user);
      throw new api401Error('Not allowed');
    }
    next();
}

module.exports = {
  authUser,
  authAdmin,
};
