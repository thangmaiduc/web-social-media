const User = require('../models/').User;
const Message = require('../models/').Message;
const _ = require('lodash');
const Participant = require('../models/').Participant;
const Conversation = require('../models/').Conversation;
const sequelize = require('../models/').sequelize;
const { QueryTypes, Op } = require('sequelize');
const Api404Error = require('../utils/errors/api404Error');
const api400Error = require('../utils/errors/api400Error');
const GeneralConstants = require('../GeneralConstants');
const noAvatar =
  'https://res.cloudinary.com/dzens2tsj/image/upload/v1661242291/chat-icon-people-group-260nw-437341633_vlkiwo.webp';
//add member
exports.addParticipant = async (req, res, next) => {
  try {
    console.log(req.params, req.body);
    let conversationId = req.params.id;
    let userId = req.user.id;
    let users = _.get(req, 'body.users', []);
    if (users.length == 0) throw new api400Error('Không có người dùng nào');

    const check = await Conversation.findOne({
      where: { id: conversationId },
    });
    if (!check) {
      throw new Api404Error('Không tìm thấy nhóm chat');
    }
    const isMember = await Participant.findOne({
      where: { userId, conversationId, type: 'public' },
    });
    if (!isMember) {
      throw new Api404Error('Không tìm thấy nhóm này');
    }
    const participants = await Participant.findAll({
      where: { conversationId },
    });
    const participantsUserId = participants.map((p) => p.userId);
    const differenceUser = _.difference(users, participantsUserId);
    console.log(differenceUser);
    differenceUser.forEach(async (userId) => {
      let check = await User.findOne({ where: { id: userId, isBlock: false } });
      try {
        check &&
          !checkPar &&
          (await Participant.create({
            userId,
            conversationId,
            type: 'public',
          }));
      } catch (error) {
        console.log(error);
      }
    });
    res.status(200).json({ message: 'Thêm thành viên thành công' });
  } catch (error) {
    next(error);
  }
};
exports.editTitle = async (req, res, next) => {
  try {
    console.log(req.params, req.body);
    let conversationId = req.params.id;
    let userId = req.user.id;
    let title = _.get(req, 'body.title', '');

    const check = await Conversation.findOne({
      where: { id: conversationId },
    });
    if (!check) {
      throw new Api404Error('Không tìm thấy nhóm chat');
    }
    const conversation = await Conversation.findOne({
      where: { creatorId: userId, id: conversationId },
    });
    if (!conversation) {
      throw new api400Error('Không có quyền sửa tên nhóm');
    }
    conversation.title = title;
    await conversation.save();
    res
      .status(200)
      .json({ message: 'Sửa tên nhóm thành công', data: conversation });
  } catch (error) {
    next(error);
  }
};
//get member of Conversation
exports.getMemberOfGroup = async (req, res, next) => {
  try {
    console.log(req.params, req.body);
    let conversationId = req.params.id;
    let userId = req.user.id;

    const check = await Conversation.findOne({
      where: { id: conversationId },
    });
    if (!check) {
      throw new Api404Error('Không tìm thấy nhóm chat');
    }
    const isMember = await Participant.findOne({
      where: { userId, conversationId },
    });
    if (!isMember) {
      throw new Api404Error('Không tìm thấy nhóm này');
    }
    let participants = await Participant.findAll({
      where: { conversationId },
      include: [
        {
          model: User,
          attributes: [
            'fullName',
            'id',
            'username',
            'profilePicture',
            'coverPicture',
          ],
        },
      ],
    });
    responseData = participants.map((p) => {
      return {
        followedId: p.User.id,
        username: p.User.username,
        profilePicture: p.User.profilePicture,
        coverPicture: p.User.coverPicture,
        fullName: p.User.fullName,
      };
    });
    res.status(200).json({ data: responseData });
  } catch (error) {
    next(error);
  }
};

//new group chat

exports.createV2 = async (req, res, next) => {
  try {
    const conversation = await Conversation.findByPk(7);
    await conversation.getDisplayName();
    const data = await conversation.getImg();

    res.status(200).json({ data });
  } catch (error) {
    next(error);
  }
};
exports.create = async (req, res, next) => {
  try {
    let users = _.get(req, 'body.users', []);
    if (users.length == 0) throw new api400Error('Không có người dùng nào');
    const title = req.body.title || '';
    const userId = req.user.id;
    if (users.length === 1) {
      const parner = await User.findByPk(users[0]);
      if (!parner) {
        throw new Api404Error('Không tìm thấy người dùng muốn thêm');
      }
      const parnerId = parner.id;
      const participantsUser = await Participant.findAll({
        where: { userId: userId },
      });
      const participantsPartner = await Participant.findAll({
        where: { userId: parnerId },
      });
      let present = _.intersectionBy(
        participantsUser,
        participantsPartner,
        'conversationId'
      );
      console.log('present:>>>>>>>>', JSON.stringify(present));
      isCreated = !present.every((p) => p.type === 'public');
      ConversationIds = present.map((p) => p.conversationId);
      let participant = null;
      if (isCreated) {
        participant = await Participant.findOne({
          where: {
            userId: parnerId,
            conversationId: {
              [Op.in]: ConversationIds,
            },
            type: 'private',
          },
          raw: true,
        });
        participant.img = parner.profilePicture;
        participant.title = parner.fullName;

        return res.status(200).json({ data: participant });
      }

      let conversation = await Conversation.create({
        creatorId: userId,
      });
      await Participant.create({
        conversationId: conversation.id,
        userId,
        type: 'private',
      });
      participant = await Participant.create({
        conversationId: conversation.id,
        userId: parnerId,
        type: 'private',
      });
      participant = participant.toJSON();
      participant.img = parner.profilePicture;
      participant.title = parner.fullName;

      return res.status(200).json({ data: participant });
    } else {
      let conversation = await Conversation.create({
        title,
        creatorId: userId,
      });
      await Participant.create({
        conversationId: conversation.id,
        userId,
        type: 'public',
      });
      let users = _.get(req, 'body.users', []);
      if (users.length == 0) throw new api400Error('Không có người dùng nào');

      const check = await Conversation.findOne({
        where: { id: conversation.id },
      });
      if (!check) {
        throw new Api404Error('Không tìm thấy nhóm chat');
      }
      users.forEach(async (userId) => {
        let checkPar = await Participant.findOne({
          where: { userId, conversationId: conversation.id },
        });
        let check = await User.findOne({ where: { id: userId } });
        try {
          check &&
            !checkPar &&
            (await Participant.create({
              userId,
              conversationId: conversation.id,
              type: 'public',
            }));
        } catch (error) {
          console.log(error);
        }
      });
      let dataResponse = {
        conversationId: conversation.id,
        creatorId: conversation.creatorId,
        type: 'public',
        title: conversation.title || 'Không có tên nhóm',
        img: noAvatar,
      };

      res
        .status(200)
        .json({ message: 'Tạo nhóm thành công', data: dataResponse });
    }

    // const userPost = await Post.findAll({ where: { userId: user.id } });

    //  return res.status(200).json({ data: participant });
  } catch (error) {
    next(error);
  }
};
exports.queryV2 = async (req, res, next) => {
  try {
    const page = parseInt(_.get(req, 'query.page', 0));
    let limit = +req.query.limit || 10;
    let offset = 0 + page * limit;
    let textSearch = req.query.textSearch;
    const userId = req.user.id;
    let where = {};
    if (!_.isEmpty(textSearch)) {
      console.log('textSearch', textSearch);
      where[Op.or] = {
        fullName: {
          [Op.like]: `%${textSearch}%`,
        },
        username: {
          [Op.like]: `%${textSearch}%`,
        },
      };
    }
    const conversationsQuery = await sequelize.query(
      `SELECT p.conversationId, p.isView FROM Participants p
      JOIN Conversations c on p.conversationId = c.id
      WHERE p.userId = ${userId}
      `,
      {
        type: QueryTypes.SELECT,
      }
    );

    const conversationIds = conversationsQuery.map((c) => c.conversationId);
    let participants = await Participant.findAll({
      include: [
        {
          association: 'user',
          attributes: ['fullName', 'id', 'username', 'profilePicture'],
          where,
        },
        {
          association: 'conversation',
          include: [
            {
              association: 'messages',
              attributes: [
                'id',
                // 'text', 'senderId', 'updatedAt'
              ],
              // nested: true,
              // all: true
              // include: [
              //   {
              //     association: 'user',
              //     attributes: ['fullName'],
              //   },
              // ],
            },
          ],
        },
      ],
      where: {
        conversationId: { [Op.in]: conversationIds },
        userId: { [Op.ne]: userId },
      },
      limit,
      offset,
      order: [
        ['conversation', 'messages', 'id', 'DESC'],
        ['conversationId', 'DESC'],
      ],

      group: 'conversationId',
    });
    let dataResponse = await Promise.all(
      participants.map(async (participant, idx) => {
        const participantsProfile = await Participant.findAll({
          where: {
            conversationId: participant.conversationId,
            userId: {
              [Op.ne]: userId,
            },
          },
          include: [
            {
              association: 'user',
              attributes: ['profilePicture', 'fullName'],
            },
          ],
          limit: 2,
        });

        const img = await participant.conversation.getImg(userId);
        // if (_.isEmpty(participant.conversation.img)) {
        //   participantsProfile.map((participant) =>
        //     img.push(participant.user.profilePicture)
        //   );
        // } else {
        //   img.push(participant.conversation.img);
        // }
        let title = await participant.conversation.getDisplayName(userId);
        // if (
        //   participant.conversation.type ===
        //   GeneralConstants.TYPE_CONVERSATION.PRIVATE
        // ) {
        //   title = participantsProfile.find((item) => item.userId !== userId)
        //     .user.fullName;
        // } else {
        //   participantsProfile.forEach((item) => {
        //     title += item.user.fullName + ', ';
        //   });
        //   title = title.substring(0, title.length - 2);
        // }
        const latestMessage = await Message.findOne({
          where: {
            conversationId: participant.conversationId,
          },
          include: [
            {
              association: 'user',
            },
          ],
          order: [['id', 'DESC']],
        });

        return {
          id: participant.conversationId,
          type: participant.conversation.type,
          title: participant.conversation.title || title,
          isAdmin: participant.isAdmin,
          img,
          isView: conversationsQuery.find(
            (item) => item.conversationId === participant.conversationId
          ).isView,
          latestMessage: {
            text: _.get(latestMessage, 'text', ''),
            senderId: _.get(latestMessage, 'senderId', null),
            fullNameSender: _.get(latestMessage, 'user.fullName', ''),
          },
          updatedAt: _.get(
            latestMessage,
            'updatedAt',
            participant.conversation.updatedAt
          ),
        };
      })
    );
    dataResponse.sort((a, b) => b.updatedAt - a.updatedAt);
    res.status(200).json({
      data: dataResponse,
    });
  } catch (error) {
    next(error);
  }
};
// exports.createV2 = async (req, res, next) => {
//   try {
//     let userIdsBody = _.get(req, 'body.users', []);

//     userIdsBody = userIdsBody.filter((val) => val !== req.user.id);
//     if (userIdsBody.length == 0)
//       throw new api400Error('Không có người dùng nào');
//     let title = req.body.title || '';
//     const userId = req.user.id;
//     let newConversation = null;
//     let img = [];
//     if (userIdsBody.length === 1) {
//       const parner = await User.findByPk(userIdsBody[0]);
//       img = [parner.profilePicture];
//       if (!parner) throw new Api404Error('Không tìm thấy người dùng muốn thêm');
//       const parnerId = parner.id;
//       title = parner.fullName;

//       // let checkExist = await Conversation.findAll({
//       //   where: {
//       //     type: GeneralConstants.TYPE_CONVERSATION.PRIVATE,
//       //   },
//       //   include: [
//       //     {
//       //       association: 'participants',
//       //       attributes: ['userId'],
//       //       // attributes: ['userId', 'username', 'profilePicture', 'id'],
//       //       where: {
//       //         userId: {
//       //           [Op.in]: [userId, parnerId],
//       //         },
//       //       },
//       //       required: true,
//       //     },
//       //   ],
//       // });
//       // checkExist = checkExist.filter((item) => item.participants.length > 1);
//       // if (checkExist.length > 0) {
//       //   res
//       //     .status(200)
//       //     .json({ data: { ...checkExist[0].toJSON(), img, title } });
//       //   return;
//       // }
//       newConversation = await Conversation.create({
//         type: GeneralConstants.TYPE_CONVERSATION.PRIVATE,
//         creatorId: userId,
//       });
//       await Promise.all(
//         [userId, parnerId].map(
//           async (userId) =>
//             await Participant.create({
//               conversationId: newConversation.id,
//               userId,
//               isAdmin: true,
//             })
//         )
//       );
//       // res.status(201).json({ data: { ...newConversation.toJSON(), img } });
//     } else {
//       newConversation = await Conversation.create({
//         title,
//         creatorId: userId,
//         type: GeneralConstants.TYPE_CONVERSATION.PUBLIC,
//       });
//       const users = await User.findAll({
//         where: {
//           id: { [Op.in]: userIdsBody },
//           isBlock: false,
//         },
//         attributes: ['id', 'fullName', 'profilePicture'],
//       });
//       const participants = users.map((user) => {
//         img.push(user.profilePicture);
//         return {
//           userId: user.id,
//           conversationId: newConversation.id,
//           isAdmin: false,
//         };
//       });
//       await Participant.create({
//         userId,
//         conversationId: newConversation.id,
//         isAdmin: true,
//       });
//       await Participant.bulkCreate(participants);
//     }
//     res.status(201).json({
//       message: 'Create conversation successfully',
//       data: { ...newConversation.toJSON(), img, title },
//     });
//   } catch (error) {
//     next(error);
//   }
// };
exports.query = async (req, res, next) => {
  try {
    const page = parseInt(_.get(req, 'query.page', 0));
    let limit = +req.query.limit || 10;
    let offset = 0 + page * limit;
    let textSearch = req.query.textSearch;
    console.log('page', page);
    console.log('limit', limit);
    console.log('offset', offset);
    const userId = req.user.id;
    let where = {};
    if (!_.isEmpty(textSearch)) {
      console.log('textSearch', textSearch);
      where[Op.or] = {
        fullName: {
          [Op.like]: `%${textSearch}%`,
        },
        username: {
          [Op.like]: `%${textSearch}%`,
        },
      };
    }
    const conversations = await sequelize.query(
      `SELECT p.conversationId, p.type   FROM Participants p
      JOIN Conversations c on p.conversationId = c.id
      WHERE p.userId = ${userId}
      `,
      {
        type: QueryTypes.SELECT,
      }
    );
    const conversationIds = conversations.map((c) => c.conversationId);
    let participants = await Participant.findAll({
      include: [
        {
          model: User,
          attributes: ['fullName', 'id', 'username', 'profilePicture'],
          where,
        },
        { model: Conversation, include: [{ model: Message, attributes: [] }] },
      ],
      where: {
        conversationId: { [Op.in]: conversationIds },
        userId: { [Op.ne]: userId },
      },
      limit,
      offset,
      order: [
        ['Conversation', 'Messages', 'updatedAt', 'DESC'],
        ['conversationId', 'DESC'],
      ],

      group: 'conversationId',
    });
    participants = participants.map((item) => {
      item = item.toJSON();
      let title;
      if (item.type === 'private') {
        title = item.User.fullName;
        img = item.User.profilePicture;
      }
      if (item.type === 'public') {
        title = item.Conversation.title || 'Nhóm không có tên';
        img = noAvatar;
      }
      return {
        ...item,
        img,
        title,
      };
    });

    // * group by xong, ta tiếp tục thêm vào set của js để bỏ trùng conversation, lại check nếu trùng conversation thì add vào mảng  participants

    res.status(200).json({ data: participants });
  } catch (error) {
    next(error);
  }
};
exports.view = async (req, res, next) => {
  try {
    await Participant.update(
      { isView: true },
      {
        where: {
          userId: req.user.id,
          isView: false,
        },
      }
    );
    res.status(204).json();
  } catch (error) {
    next(error);
  }
};
