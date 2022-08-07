const User = require('../models/').User;
const _ = require('lodash');
const Participant = require('../models/').Participant;
const Conversation = require('../models/').Conversation;
const sequelize = require('../models/').sequelize;
const { QueryTypes } = require('sequelize');
const Api404Error = require('../utils/errors/api404Error');
const api400Error = require('../utils/errors/api400Error');
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
      check &&
        !checkPar &&
        (await Participant.create({ userId, conversationId, type: 'public' }));
    });
    res.status(200).json({ message: 'thêm thành công' });
  } catch (error) {
    next(error);
  }
};
//new group chat

exports.create = async (req, res, next) => {
  try {
    const username = req.query.username;
    const title = req.body.title || '';
    const userId = req.user.id;
    if (username) {
      const parner = await User.findOne({ where: { username } });
      const parnerId = parner.id;
      const participants = await Participant.findAll({
        where: { userId: parnerId },
      });
      let res = {};
      if (participants.length > 0) {
        let check;

        participants.forEach(async (participant, i) => {
          // console.log(participant);
          check = await Participant.findOne({
            where: {
              userId,
              conversationId: participant.conversationId,
              type: 'private',
            },
          });
          if (check) return true;

          if (!check && i === participants.length - 1) {
            let conversation = await Conversation.create({
              // title: user.fullName,
              creatorId: userId,
            });
            await Participant.create({
              conversationId: conversation.id,
              userId,
              type: 'private',
            });
            await Participant.create({
              conversationId: conversation.id,
              userId: parnerId,
              type: 'private',
            });
          }
        });
      } else {
        let conversation = await Conversation.create({
          // title: user.fullName,
          creatorId: userId,
        });
        await Participant.create({
          conversationId: conversation.id,
          userId,
          type: 'private',
        });
        await Participant.create({
          conversationId: conversation.id,
          userId: parnerId,
          type: 'private',
        });
      }
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

    res.status(200).json({ message: 'ok' });
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
        item.title = users[0].fullName;
        item.img = users[0].profilePicture;
        return item
        }
      })
    );

    // const userPost = await Post.findAll({ where: { userId: user.id } });

    res.status(200).json({ data: conversations2 });
  } catch (error) {
    next(error);
  }
};
