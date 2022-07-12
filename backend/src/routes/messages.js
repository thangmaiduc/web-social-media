const router = require('express').Router();
const messageController = require('../controller/messages')


router.get('/:conversationId',messageController.getMessageOfConversation )
router.post('/', messageController.create)




// get friends

module.exports=  router