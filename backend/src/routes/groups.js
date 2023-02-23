const router = require('express').Router();

const groupController = require('../controller/groups');

//add member
router.put('/members/approve', groupController.approve);
router.put('/members/reject', groupController.reject);
//get member
router.post('/members/get', groupController.getMemberOfGroup);
router.post('/members/:id', groupController.addMembers);

router.put('/members/ban', groupController.banMember);
router.delete('/members/delete', groupController.deleteMember);
//new private chat
// router.post("/", groupController.createPrivate);

//new group chat

router.post('/', groupController.create);
router.put('/:id', groupController.updateGroup);

router.get('/query', groupController.query);
router.get('/', groupController.getAll);

module.exports = router;
