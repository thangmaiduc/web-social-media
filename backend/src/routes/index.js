const router = require("express").Router();
const userRouter = require("./users");
const { authUser } = require("../middlewares/auth");
const authRouter = require("../routes/auth");
router.use("/auth", authRouter);
router.use(authUser);

const postRouter = require("./posts");
const commentRouter = require("./comments");
const conversationRouter = require("./conversations");
const messageRouter = require("./messages");
// var { authUser } = require("../middlewares/auth");

router.use("/users", userRouter);

router.use("/posts", postRouter);
router.use("/comments", commentRouter);
router.use("/conversations", conversationRouter);
router.use("/messages", messageRouter);

module.exports = router;
