const router = require("express").Router();

const postController = require("../controller/posts");

router.get("/", (req, res) => {
  res.json("hello world");
});
//create
router.post("/", postController.create);
//query
router.get("/query", postController.query);
//update
router.put("/:id", postController.update);
//delete a post
router.delete("/:id", postController.delete);
// get posts timeline
router.get("/timeline/", postController.queryTimeLine);
//get posts on profile
router.get("/profile/:username", postController.getProfilePost);
// get a post

router.get("/:id", postController.get);
// like a post
router.put("/:id/like", postController.like);
router.put("/:id/report", postController.report);
// // comment a post
// router.post("/:id/comment", postController.addComment);
// // edit a comment
// router.get("/:id/comment", postController.getComments);


const userController = require("../controller/users");

module.exports = router;
