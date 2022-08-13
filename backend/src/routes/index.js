const router = require('express').Router();
const userRouter = require('./users');
const { authUser, authAdmin } = require('../middlewares/auth');
const authRouter = require('../routes/auth');
const fileUploader = require('../utils/cloudinary');
router.use(
  '/auth',
  authRouter
  // #swagger.tags = ['Auth']
  // #swagger.description = 'Endpoint for login, logout, forget password.'

  /* #swagger.responses[500] = {
            description: "Error Internal Server"
    } */
  /* #swagger.responses[404] = {
            description: "Not found "
    } */
);
router.use(authUser);

const postRouter = require('./posts');
const commentRouter = require('./comments');
const adminRouter = require('./admin');
const conversationRouter = require('./conversations');
const messageRouter = require('./messages');
// var { authUser } = require("../middlewares/auth");

router.use(
  '/users',
  userRouter
  // #swagger.tags = ['Users']
  // #swagger.description = 'Endpoint for users.'
  /* #swagger.security = [{
        "Bearer": []
    }] */
);

router.use(
  '/posts',
  postRouter
  // #swagger.tags = ['Posts']
  // #swagger.description = 'Endpoint for posts.'
  /* #swagger.security = [{
        "Bearer": []
    }] */
);
router.use(
  '/comments',
  commentRouter
  // #swagger.tags = ['Comments']
  // #swagger.description = 'Endpoint for comments.'
  /* #swagger.security = [{
        "Bearer": []
    }] */
);
router.use(
  '/conversations',
  conversationRouter
  // #swagger.tags = ['Conversations']
  // #swagger.description = 'Endpoint for conversations.'
  /* #swagger.security = [{
        "Bearer": []
    }] */
);
router.use(
  '/messages',
  messageRouter
  // #swagger.tags = ['Messages']
  // #swagger.description = 'Endpoint for messages.'
  /* #swagger.security = [{
        "Bearer": []
    }] */
);

router.post(
  '/cloudinary-upload',
  fileUploader.single('file'),
  (req, res, next) => {
    if (!req.file) {
      next(new Error('No file uploaded!'));
      return;
    }

    res.json({ secure_url: req.file.path });
  }
);

router.use(authAdmin);
router.use(
  '/admin',
  adminRouter
  // #swagger.tags = ['Admin']
  // #swagger.description = 'Endpoint for messages.'
  /* #swagger.security = [{
        "Bearer": []
    }] */
);
module.exports = router;
