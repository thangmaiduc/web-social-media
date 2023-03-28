const router = require('express').Router();

const conversationController = require('../controller/conversations');

router.post('/members/:id', conversationController.addParticipant);
router.get('/members/:id', conversationController.getMemberOfGroup);
router.post('/', conversationController.createV2);
router.post('/view', conversationController.view);
router.put('/:id', conversationController.editTitle);
router.get('/', conversationController.queryV2);

module.exports = router;
