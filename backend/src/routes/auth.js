const router = require('express').Router();
const authController = require('../controller/auth');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const { validate } = require("../middlewares/validation");
const CLIENT_URL = 'http://localhost:3000/';
const ADMIN_URL = 'http://localhost:3005/';

router.get("/logout", (req, res) => {
    req.logout();
    res.redirect(CLIENT_URL);
  });
router.get('/login/success', (req, res) => {
  if (req.user) {
    console.log(req.user);
    let token = jwt.sign({ userId: req.user.id, isAdmin: req.user.isAdmin }, process.env.JWT_KEY, {
      expiresIn: '3 days',
    });
    console.log(token);
    res.setHeader('authToken', token);
    res.status(200).json({
      success: true,
      message: 'successfull',
      user: req.user,
      token
      //   cookies: req.cookies
    });
  }else{
    res.status(401).send('authorizationError')
  }
});

router.get('/login/failed', (req, res) => {
  res.status(401).json({
    success: false,
    message: 'failure',
  });
});

router.get('/logout', (req, res) => {
  req.logout();
  res.redirect(CLIENT_URL);
});

router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get(
  '/google/callback',
  passport.authenticate('google', {
    successRedirect: CLIENT_URL,
    failureRedirect: 'api/auth/login/failed',
  })
);

router.post('/login', 
validate.validateLogin()
,authController.login);
router.post('/admin/login',validate.validateLogin(), authController.loginAdmin);
router.post('/register',validate.validateRegisterUser(), authController.register);
router.put('/forgot-password', authController.forgotPassword);
// get friends

module.exports = router;
