const router = require("express").Router();

const postController = require("../controller/posts");

router.get("/", (req, res) => {
  res.json("hello world");
});
//create
router.post("/", postController.create);
//update
router.put("/:id", postController.update);
//delete a post
router.delete("/:id", postController.delete);
// get posts timeline
router.get("/timeline/", postController.getTimeLine);
//get posts on profile
router.get("/profile/:username", postController.getProfilePost);
// get a post

router.get("/:id", postController.get);
// like a post
router.put("/:id/like", postController.like);
// get posts timeline

const userController = require("../controller/users");

module.exports = router;
