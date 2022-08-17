const router = require("express").Router();
const authController = require("../controller/auth");

router.post("/login", authController.login);
router.post("/admin/login", authController.loginAdmin);
router.post("/register", authController.register);
router.put('/forgot-password', authController.forgotPassword );
// get friends

module.exports = router;
