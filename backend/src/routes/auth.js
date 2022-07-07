const router = require("express").Router();
const authController = require("../controller/auth");

router.post("/login", authController.login);
router.post("/register", authController.register);

// get friends

module.exports = router;
