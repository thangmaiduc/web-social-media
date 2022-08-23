const User = require('../models/').User;
const _ = require('lodash');
const Participant = require('../models/').Participant;
const Conversation = require('../models/').Conversation;
const sequelize = require('../models/').sequelize;
const { QueryTypes, Op } = require('sequelize');
const Api404Error = require('../utils/errors/api404Error');
const api400Error = require('../utils/errors/api400Error');
const noAvatar =
  'https://res.cloudinary.com/dzens2tsj/image/upload/v1661242291/chat-icon-people-group-260nw-437341633_vlkiwo.webp';
//add member
exports.addParticipant = async (req, res, next) => {
  try {
    console.log(req.params, req.body);
    let conversationId = req.params.id;
    let users = req.body.users;
    if (users.length == 0) res.status(400).json('failed');

    const check = await Conversation.findOne({
      where: { id: conversationId },
    });
    if (!check) {
      throw new Api404Error('Không tìm thấy nhóm');
    }
    users.forEach(async (userId) => {
      let checkPar = await Participant.findOne({
        where: { userId, conversationId },
      });
      let check = await User.findOne({ where: { id: userId } });
      check && !checkPar && (await Participant.create({ userId, conversationId, type: 'public' }));
    });
    res.status(200).json({ message: 'thêm thành công' });
  } catch (error) {
    next(error);
  }
};
//new group chat

exports.create = async (req, res, next) => {
  try {
    const username = _.get(req, 'query.username', '');
    console.log(username);
    const title = req.body.title || '';
    const userId = req.user.id;
    if (!_.isEmpty(username)) {
      const parner = await User.findOne({ where: { username } });
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
      let present = _.intersectionBy(participantsUser, participantsPartner, 'conversationId');
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

    }

    // const userPost = await Post.findAll({ where: { userId: user.id } });

    //  return res.status(200).json({ data: participant });
  } catch (error) {
    next(error);
  }
};
// exports.create = async (req, res, next) => {
//   try {
//     const username = req.query.username;
//     let userId = req.user.id;
//     if (username) {
//       const user = await User.findOne({ where: { username } });
//       const parnerId = user.id;
//       const participants = await Participant.findAll({
//         where: { userId: parnerId },
//       });
//       let res = {};

//       check = participants.find(async (participant) => {
//         let check = await Participant.findOne({
//           where: { userId, conversationId: participant.conversationId },
//         });
//         if (check) return check;
//       });
//       console.log(check);
//       if (!check) {
//         conversation = await Conversation.create({
//           tittle: user.fullName,
//           creatorId: userId,
//         });
//         await Participant.create({ conversationId: conversation.id, userId });
//         await Participant.create({
//           conversationId: conversation.id,
//           userId: user.id,
//         });
//       }
//     } else {
//     }

//     // const userPost = await Post.findAll({ where: { userId: user.id } });

//     res.status(200).json({ message: "ok" });
//   } catch (error) {
//     next(error);
//   }
// };

// exports.createPrivate = async (req, res, next) => {
//   try {

//     res.status(200).json({ message: userPost });
//   } catch (error) {
//     next(error);
//   }
// };

//get conv of a user
exports.query = async (req, res, next) => {
  try {
    const page = parseInt(_.get(req, 'query.page', 0));
    let limit = +req.query.limit || 15;
    let offset = 0 + page * limit;
    let textSearch = req.query.textSearch;
    console.log('page', page);
    console.log('limit', limit);
    console.log('offset', offset);
    const userId = req.user.id;
    let where = {};
    if (!_.isEmpty(textSearch)) {
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
        { model: User, attributes: ['fullName', 'id', 'username', 'profilePicture'], where },
        { model: Conversation },
      ],

      where: {
        conversationId: { [Op.in]: conversationIds },
        userId: { [Op.ne]: userId },
      },
      limit,
      offset,
      // raw: true
      // group: 'conversationId'
    });
    _.forEach(participants, (i) => {
      console.log(i.toJSON());
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
exports.get = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const conversations = await sequelize.query(
      `SELECT p.conversationId, p.type   FROM Participants p
      JOIN Conversations c on p.conversationId = c.id
      WHERE p.userId = ${userId}
      `,
      {
        type: QueryTypes.SELECT,
      }
    );
    // conversations.length > 0 &&
    //   _.forEach(conversations, async (item) => {
    //     if (item.type === 'private') {
    //       const users = await sequelize.query(
    //         `SELECT * FROM Participants p
    //        JOIN users u on p.userId = u.id
    //        WHERE p.conversationId = ${item.conversationId} and p.userId <> ${userId}
    //        `,
    //         {
    //           type: QueryTypes.SELECT,
    //         }
    //       );
    //       item.title = users[0].fullName;
    //       item.img = users[0].profilePicture;
    //       console.log(item);
    //     }
    //   });

    let conversations2 = await Promise.all(
      conversations.map(async (item) => {
        console.log(item);
        if (item.type === 'private') {
          const users = await sequelize.query(
            `SELECT * FROM Participants p
               JOIN Users u on p.userId = u.id
               WHERE p.conversationId = ${item.conversationId} and p.userId <> ${userId}
               `,
            {
              type: QueryTypes.SELECT,
            }
          );
          item.title = users[0]?.fullName || 'No Name';
          item.img = users[0]?.profilePicture;
          return item;
        }
      })
    );

    // const userPost = await Post.findAll({ where: { userId: user.id } });

    res.status(200).json({ data: conversations2 });
  } catch (error) {
    next(error);
  }
};
