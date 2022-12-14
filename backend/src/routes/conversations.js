const router = require("express").Router();

const conversationController = require("../controller/conversations");

//add member
router.post("/members/:id", conversationController.addParticipant);
//get member
router.get("/members/:id", conversationController.getMemberOfGroup);
//new private chat
// router.post("/", conversationController.createPrivate);

//new group chat

router.post("/", conversationController.create);
router.put("/:id", conversationController.editTitle);

//get conv of a user

router.get("/", conversationController.query);

// get conv includes two userId

// router.get("/find/:firstUserId/:secondUserId", async (req, res) => {
//   try {
//     const conversation = await Conversation.findOne({
//       members: { $all: [req.params.firstUserId, req.params.secondUserId] },
//     });
//     res.status(200).json(conversation);
//   } catch (err) {
//     res.status(500).json(err);
//   }
// });

module.exports = router;
