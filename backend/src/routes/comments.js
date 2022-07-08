const router = require("express").Router();

const commentController = require("../controller/comments");

// router.get("/", (req, res) => {
//   res.json("hello world");
// });
//create

// comment a post
router.post("/", commentController.create);
// edit a comment
router.get("/posts/", commentController.getCommentsPost);
// edit a comment
router.put("/:id", commentController.update);
// delete a comment
router.delete("/:id", commentController.delete);
// 1 so cau lenh thong ke binh luan cho admin
// router.get("/:userId", commentController.get);



module.exports = router;
