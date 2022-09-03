const {check} = require('express-validator');

let validateRegisterUser = () => {
  return [ 
    check('email', 'Email không chính xác').not().isEmpty(),
    check('username', 'Tên người dùng không chính xác').not().isEmpty(),
    check('email',  'Email tối thiểu phải 7 kí tự').isLength({ min: 7 }),
    check('username',  'Tên người dùng tối thiểu phải 5 kí tự').isLength({ min: 5 }),
    check('fullName',  'Họ tên không chính xác').not().isEmpty(),
    check('fullName',  'Họ tên tối thiểu phải 5 kí tự').isLength({ min: 5 }),
    check('email', 'Email không chính xác').isEmail(),
    check('password', 'Mật khẩu tối thiểu phải 6 kí tự').isLength({ min: 6 })
  ]; 
}

let validateLogin = () => {
  return [ 
    check('email', 'Email không chính xác').not().isEmpty(),
    // check('email', 'Email không chính xác').isEmail(),
    check('password', 'Mật khẩu tối thiểu phải 6 kí tự').isLength({ min: 6 })
  ]; 
}
let validateChangePassword = () => {
  return [ 
    check('password', 'Mật khẩu tối thiểu phải 6 kí tự').isLength({ min: 6 }),
    check('oldPassword', 'Mật khẩu cũ tối thiểu phải 6 kí tự').isLength({ min: 6 }),
  ]; 
}


let validate = {
    validateRegisterUser,
    validateLogin,
    validateChangePassword
  };
  
  module.exports = {validate};