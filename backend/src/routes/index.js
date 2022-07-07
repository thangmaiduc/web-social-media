const router = require("express").Router();
const userRouter = require("./users");
const {authUser} = require('../middlewares/auth')
router.use( authUser);

// const postRouter = require("./posts");
// const conversationRouter = require("./conversations");
// const messageRouter = require("./messages");
// var { authUser } = require("../middlewares/auth");

router.use("/users", userRouter);

// router.use("/posts", postRouter);
// router.use("/conversations", conversationRouter);
// router.use("/messages", messageRouter);

module.exports = router;
