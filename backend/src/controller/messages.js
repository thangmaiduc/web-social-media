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
    const page = parseInt(_.get(req, 'query.page', 0));
    console.log(page);
    let limit = +req.query.limit || 10;
    let offset = 0 + page * limit;
    const textSearch = req.query.textSearch;
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
    let where = { conversationId };
    if (!_.isEmpty(textSearch)) {
      where = {
        text: {
          [Op.like]: `%${textSearch}%`,
        },
      };
    }
    const messages = await Message.findAll({
      where,
      include: [
        {
          model: User,
          required: true,
          attributes: [['profilePicture', 'img'], 'fullName', 'id', 'username'],
        },
        {
          model: Attachment,
        },
      ],
      order: [['createdAt', 'DESC']],
      limit,
      offset,
    });
       res.status(200).json({ data: messages.reverse() });
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
    if (!_.isNil(fileUrl)) {
      await Attachment.create({ messageId: messageCreated.id, fileUrl });
    }
    let message;
    if (_.get(messageCreated, 'id', null) !== null) {
      message = await Message.findOne({
        where: { id: messageCreated.id },
        include: [
          {
            model: User,
            required: true,
            attributes: [['profilePicture', 'img']],
          },
          {
            model: Attachment,
          },
        ],
      });
    }
    res.status(201).json({ data: message });
  } catch (error) {
    next(error);
  }
};
