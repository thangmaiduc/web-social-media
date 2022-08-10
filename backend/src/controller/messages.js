const User = require('../models/').User;
const _ = require('lodash');
const Participant = require('../models/').Participant;
const Message = require('../models/').Message;
const Attachment = require('../models/').Attachment;
const Conversation = require('../models/').Conversation;
const sequelize = require('../models/').sequelize;
const { QueryTypes } = require('sequelize');
const Api404Error = require('../utils/errors/api404Error');
const api400Error = require('../utils/errors/api400Error');
const { first } = require('lodash');
exports.getMessageOfConversation = async (req, res, next) => {
  try {
    const conversationId = req.params.conversationId;
    let userId = req.user.id;
    const conversation = await Conversation.findOne({
      where: { id: conversationId },
    });
    if (!conversation) throw new Api404Error('Không tìm thấy cuộc trò chuyện');
    const participant = await Participant.findOne({
      where: { conversationId, userId },
    });
    if (!participant) throw new Api404Error('Không tìm thấy cuộc trò chuyện');
    // const messages = await Message.findAll({
    //   where: { conversationId },
    // });
    const messages = await Message.findAll({
      where: { conversationId },
      include: [
        {
          model: User,
          required: true,
          attributes: [['profilePicture', 'img']],
        },
      ],
      raw: true,
    });
    const attachments = await Promise.all(
      messages.map((m) => {
        return Attachment.findOne({
          where: { messageId: m.id },
        });
      })
    );

    // const attachments = await Attachment.findOne({
    //   where: { messageId : messages.id  },
    // })

    _.forEach(messages, (item) => {
      item.attachments = [];
      item.img = item['User.img'];
      delete item['User.img'];
      _.forEach(attachments, (attachment) => {
        if (attachment && attachment.messageId === item.id) {
          item.attachments.push(attachment);
        }
      });
    });

    // const userPost = await Post.findAll({ where: { userId: user.id } });

    res.status(200).json({ data: messages });
  } catch (error) {
    next(error);
  }
};
exports.create = async (req, res, next) => {
  try {
    const { conversationId, text, fileUrl } = req.body;
    let senderId = req.user.id;
    const conversation = await Conversation.findOne({
      where: { id: conversationId },
    });
    if (!conversation) throw new Api404Error('Không tìm thấy cuộc trò chuyện');
    const participant = await Participant.findOne({
      where: { conversationId, userId: senderId },
    });
    if (!participant) throw new Api404Error('Không tìm thấy cuộc trò chuyện');
    const messageCreated = await Message.create({ senderId, text, conversationId });
    let message
    if(_.get(messageCreated, 'id', null)!==null){
      message = await Message.findOne({
        where:{ id : messageCreated.id},
        raw: true
      })
    }
    message.attachment=[];
    let attachment
    if (!_.isNil(fileUrl)) {
      attachment = await Attachment.create({ messageId: message.id, fileUrl });
      message.attachment.push(attachment);
    }
    message.img = req.user.profilePicture;
    
    // _.forEach(messages, (item) => {
    //   item.attachments = [];
    //   item.img = item['User.img'];
    //   delete item['User.img'];
    //   _.forEach(attachments, (attachment) => {
    //     if (attachment && attachment.messageId === item.id) {
    //       item.attachments.push(attachment);
    //     }
    //   });
    // });

    res.status(201).json({ data: message });
  } catch (error) {
    next(error);
  }
};
