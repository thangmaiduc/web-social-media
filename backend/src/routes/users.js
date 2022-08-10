const router = require("express").Router();
const bcrypt = require("bcrypt");

const userController = require('../controller/users')

//update

router.put("/",  userController.update);
//delete a user
router.delete("/:id", userController.delete);


//getme
router.get("/me",userController.getMe);
//get all user's friends
router.get("/friends/:username", userController.getFriends);
//get a user
router.get("/:username",userController.get);
//follow a user
router.put('/:id/follow',userController.follow)
//unfollow a user
router.get("/:id",userController.getById);
router.put('/:id/unfollow',userController.unfollow)
router.get("/",userController.getAll);


module.exports = router;
