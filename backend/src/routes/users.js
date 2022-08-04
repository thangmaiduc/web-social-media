const router = require("express").Router();
const bcrypt = require("bcrypt");

const userController = require('../controller/users')

//update

router.put("/",  userController.update);
//delete a user
router.delete("/:id", userController.delete);
//get a user
router.get("/:username",userController.get);
//getme
router.get("/me",userController.getMe);
//get all user's friends
router.get("/friends/:username", userController.getFriends);

//follow a user
router.put('/:id/follow',userController.follow)
//unfollow a user

router.put('/:id/unfollow',userController.unfollow)



module.exports = router;
