const router = require("express").Router();

const adminController = require("../controller/admin");

// router.get("/", (req, res) => {
//   res.json("hello world");
// });
//create

// edit a admin
router.get("/dashboard/", adminController.statisDashboard);
router.get("/users/", adminController.queryUser);
router.get("/posts/", adminController.queryPost);
// edit a admin
// router.put("/:id", adminController.update);
// // delete a admin
// router.delete("/:id", adminController.delete);
// 1 so cau lenh thong ke binh luan cho admin
// router.get("/:userId", adminController.get);



module.exports = router;
