const api401Error = require('../utils/errors/api401Error');
const api404Error = require('../utils/errors/api404Error');
const api400Error = require('../utils/errors/api400Error');
const redis = require('../utils/redis');
const User = require('../models/').User;
const Post = require('../models/').Post;
const Group = require('../models/').Group;
const GroupMember = require('../models/').GroupMember;
const LikePost = require('../models/').LikePost;
const ReportPost = require('../models/').ReportPost;
const CommentPost = require('../models/').CommentPost;
const Notification = require('../models/').Notification;
const ReceiverNotification = require('../models/').ReceiverNotification;
const sequelize = require('../models/').sequelize;
const alertInteraction = require('../utils/alertInteraction');
const { QueryTypes, Op } = require('sequelize');
const _ = require('lodash');
const client = require('../../config/es');
const moment = require('moment');
const { format } = require('../utils/time');
const GeneralConstants = require('../GeneralConstants');
const receiverNotification = require('../models/receiverNotification');
require('moment-duration-format');
//create

exports.create = async (req, res, next) => {
  try {
    const { description, img, groupId = null } = req.body;
    let statePost = GeneralConstants.STATE_POST.PENDING;
    const userId = req.user.id;
    const createPost = { ...req.body, userId, state: statePost, groupId };
    if (groupId !== null) {
      const checkGroup = await Group.findOne({
        where: {
          id: groupId,
          state: GeneralConstants.STATE_GROUP.ACTIVATED,
        },
      });

      if (!checkGroup) {
        throw new api400Error('Group does not exist or is not activated');
      }

      const checkMember = await GroupMember.findOne({
        where: {
          groupId,
          userId,
          state: GeneralConstants.STATE_MEMBER.APPROVED,
        },
      });
      if (!checkMember) {
        throw new api400Error('You are not a member of this group');
      }

      if (checkGroup.type === GeneralConstants.TYPE_GROUP.FREE) {
        statePost = GeneralConstants.STATE_POST.APPROVED;
      }
      // createPost.groupId = checkGroup.id;
    } else {
      statePost = GeneralConstants.STATE_POST.APPROVED;
    }
    createPost.state = statePost;
    const post = await Post.create(createPost);
    await ReceiverNotification.create({
      subjectId: post.id,
      receiverId: userId,
      type: GeneralConstants.TYPE_NOTIFY.COMMENT,
    });
    await ReceiverNotification.create({
      receiverId: userId,
      subjectId: post.id,
      type: GeneralConstants.TYPE_NOTIFY.LIKE,
    });
    // await post.save();
    res.status(201).json(post);
  } catch (error) {
    next(error);
  }
};
const createNotification = async ({ userId, subjectId, text, type }) => {
  try {
    const checkUser = await User.findByPk(userId);
    if (!checkUser) throw new api404Error('User not found');
    const checkPost = await Post.findByPk(subjectId);
    if (!checkPost) throw new api404Error('Post not found');
    const ownerSubject = await User.findByPk(checkPost.userId);
    let notification = await Notification.findOne({
      where: {
        subjectId,
        type,
      },
    });
    // const onceReceiveTypes = [GeneralConstants.TYPE_NOTIFY.LIKE];
    // if (checkNotification && onceReceiveTypes.includes(type))
    //   throw new api400Error('Notification was existed');
    // switch (type) {
    //   case GeneralConstants.TYPE_NOTIFY.LIKE:
    // }
    let totalCount = 1;
    if (notification) {
      notification.text = text;
      // notification.isView = false;
      notification.userId = userId;
      notification = await notification.save();
      switch (type) {
        case GeneralConstants.TYPE_NOTIFY.LIKE: {
          totalCount = await LikePost.count({ where: { postId: subjectId } });
          break;
        }
        case GeneralConstants.TYPE_NOTIFY.COMMENT: {
          totalCount = await CommentPost.count({
            where: { postId: subjectId },
            distinct: true,
            col: 'userId',
          });
          const [receiver, created] = await ReceiverNotification.findOrCreate({
            where: { subjectId, receiverId: userId, type },
          });
          console.log('created', created);
          console.log('receiver', !!receiver);
          break;
        }
        default:
          break;
      }
    } else {
      notification = await Notification.create({
        userId,
        subjectId,
        text,
        type,
      });
    }
    await ReceiverNotification.update(
      { isView: false },
      {
        where: { subjectId, type },
      }
    );

    const receiverList = await ReceiverNotification.findAll({
      where: {
        subjectId,
        type,
        state: GeneralConstants.STATE_NOTIFY.ACTIVATED,
      },
    });
    const receiverIds = receiverList.map((receiver) => receiver.receiverId);

    // return notification;
    let content = `${GeneralConstants.CONTENT_NOTIFY[type]}`;
    // van a va {so ng} nguoi khac thich bai viet cua ban
    return {
      userId: notification.userId,
      id: notification.id,
      subjectId,
      subjectOwnerId: ownerSubject.id,
      ownerFullName: ownerSubject.fullName,
      receiverIds,
      type,
      total: totalCount,
      content,
      createdAt: notification.updatedAt,
      img: checkUser.profilePicture,
      username: checkUser.username,
      fullName: checkUser.fullName,
      isView: false,
    };
  } catch (error) {
    console.log(error.message);
    return error;
  }
};
exports.createNotification = createNotification;
exports.notify = async (req, res, next) => {
  try {
    const { subjectId, text, type } = req.body;
    const userId = req.body.userId || req.user.id;
    switch (type) {
      case GeneralConstants.TYPE_NOTIFY.LIKE: {
        await LikePost.findOrCreate({
          where: {
            postId: subjectId,
            UserId: userId,
          },
        });

        break;
      }
      case GeneralConstants.TYPE_NOTIFY.COMMENT: {
        await CommentPost.create({
          postId: subjectId,
          text,
          userId,
        });
        break;
      }
      default:
        break;
    }

    const notification = await this.createNotification({ ...req.body, userId });
    res.status(201).json({ data: notification });
  } catch (error) {
    next(error);
  }
};
exports.getNotifications = async (req, res, next) => {
  try {
    const page = parseInt(_.get(req, 'query.page', 0));
    let limit = +req.query.limit || 10;
    let offset = 0 + page * limit;
    const userId = req.user.id;
    const subjects = await ReceiverNotification.findAll({
      where: {
        receiverId: userId,
        state: GeneralConstants.STATE_NOTIFY.ACTIVATED,
      },
    });
    const subjectFilter = {
      COMMENT: [],
      LIKE: [],
    };
    subjects.forEach((subject) => {
      subjectFilter[subject.type].push(subject.subjectId);
    });

    const notifications = await Notification.findAll({
      where: {
        [Op.or]: [
          {
            subjectId: {
              [Op.in]: subjectFilter[GeneralConstants.TYPE_NOTIFY.COMMENT],
            },
            type: GeneralConstants.TYPE_NOTIFY.COMMENT,
          },
          {
            subjectId: {
              [Op.in]: subjectFilter[GeneralConstants.TYPE_NOTIFY.LIKE],
            },
            type: GeneralConstants.TYPE_NOTIFY.LIKE,
          },
        ],
      },
      include: [
        {
          association: 'user',
          attributes: ['fullName', 'username', 'profilePicture', 'id'],
        },
      ],
      order: [['updatedAt', 'DESC']],
      limit,
      offset,
      // raw: true,
      // nest: true,
    });

    const responseData = await Promise.all(
      notifications.map(async (notification) => {
        let Subject = null;
        let totalCount = 1;
        let includes = [
          {
            association: 'user',
            attributes: ['id', 'fullName'],
          },
        ];
        switch (notification.type) {
          case GeneralConstants.TYPE_NOTIFY.COMMENT: {
            totalCount = await CommentPost.count({
              where: { postId: notification.subjectId },
              distinct: true,
              col: 'userId',
            });
            Subject = Post;
            break;
          }
          case GeneralConstants.TYPE_NOTIFY.LIKE: {
            totalCount = await LikePost.count({
              where: { postId: notification.subjectId },
              distinct: true,
              col: 'userId',
            });
            Subject = Post;
            break;
          }
          case GeneralConstants.TYPE_NOTIFY.JOIN_GROUP: {
            totalCount = await GroupMember.count({
              where: {
                groupId: notification.subjectId,
                state: GeneralConstants.STATE_MEMBER.PENDING,
              },
              distinct: true,
              col: 'userId',
            });
            Subject = Group;
            includes = [];
            break;
          }
        }
        const subject = await Subject.findOne({
          where: { id: notification.subjectId },
          include: includes,
        });

        let contentObject =
          userId === subject.userId
            ? 'bạn'
            : _.get(subject, 'user.fullName', null) || subject.title;
        let content = `${GeneralConstants.CONTENT_NOTIFY[notification.type]}`;
        let countStr = '';
        // van a va {so ng} nguoi khac thich bai viet cua ban
        // van a va {so ng} nguoi khac yeu cau gia nhap nhom {ten nhom}
        if (totalCount > 1) countStr = `và ${totalCount - 1} người khác`;
        content = ` ${countStr} ${content} ${contentObject}: ${notification.text}`;
        let isView = subjects.find(
          (ele) =>
            ele.subjectId === notification.subjectId &&
            ele.type === notification.type
        ).isView;
        return {
          userId: notification.user.userId,
          id: notification.id,
          content,
          subjectId: notification.subjectId,
          type: notification.type,
          total: totalCount,
          img: notification.user.profilePicture,
          username: notification.user.username,
          fullName: notification.user.fullName,
          createdAt: notification.updatedAt,
          isView,
        };
      })
    );

    res.status(200).json({ data: responseData });
  } catch (error) {
    next(error);
  }
};
exports.view = async (req, res, next) => {
  try {
    await ReceiverNotification.update(
      { isView: true },
      {
        where: {
          receiverId: req.user.id,
          isView: false,
        },
      }
    );
    res.status(204).json();
  } catch (error) {
    next(error);
  }
};
exports.numNotifications = async (req, res, next) => {
  try {
    const numNotifications = await Notification.count({
      userId: req.user.id,
      isView: false,
    });

    res.status(200).json({ data: numNotifications });
  } catch (error) {
    next(error);
  }
};
exports.index = async (req, res, next) => {
  try {
    Post.findAll().then((posts) => {
      posts.forEach((post) => {
        client.index(
          {
            index: 'posts',
            type: 'posts',
            id: post.id,
            body: {
              id: post.id,
              description: post.description,
              isBlock: post.isBlock,
              userId: post.userId,
            },
          },
          (error, response) => {
            if (error) {
              console.log(error);
            } else {
              console.log(response);
            }
          }
        );
      });
    });

    res.status(201).json('Success');
  } catch (error) {
    next(error);
  }
};
// router.post("/upload", upload.single("image"), async (req, res, next) => {
//   try {

//     if (req.user.cloudinary_id) {
//       await cloudinary.uploader.destroy(req.user.cloudinary_id);
//     }
//     const result = await cloudinary.uploader.upload(req.file.path);
//     (req.user.avatar = result.secure_url),
//       (req.user.cloudinary_id = result.public_id),

//       await req.user.save();
//     res.status(200).json(req.user);
//   } catch (err) {
//     next(err);
//   }
// });
//update
exports.update = async (req, res, next) => {
  const updates = Object.keys(req.body);
  const allowsUpdate = ['description'];
  description = req.body.description;
  const isValidUpdate = updates.every((update) =>
    allowsUpdate.includes(update)
  );
  try {
    if (!isValidUpdate) {
      throw new api400Error('Thay đổi không hợp lệ"');
    }
    let id = req.params.id;
    const post = await Post.findByPk(id);
    if (!post || _.get(post, 'isBlock', false) === true)
      throw new api404Error('Không thấy bài viết nào');
    if (post.userId === req.user.id) {
      updates.forEach((update) => (post[update] = req.body[update]));
      await post.save();
      res.status(200).json('Sửa bài viết thành công');
    } else {
      res.status(403).json('Bạn không thể sửa bài viết này');
    }
  } catch (error) {
    next(error);
  }
};
//delete a post
exports.delete = async (req, res, next) => {
  try {
    let id = req.params.id;
    const post = await Post.findByPk(id);
    if (!post || _.get(post, 'isBlock', false) === true)
      throw new api404Error('Không thấy bài viết nào');
    if (post.userId === req.user.id || req.user.isAdmin === true) {
      await CommentPost.destroy({
        where: {
          postId: post.id,
        },
      });
      await post.destroy();
      res.status(204).json();
    } else {
      res.status(403).json('you just can delete your post');
    }
  } catch (error) {
    next(error);
  }
};
// get a post
exports.get = async (req, res, next) => {
  try {
    let id = req.params.id;
    const post = await Post.findByPk(id);
    if (!post || _.get(post, 'isBlock', false) === true)
      throw new api404Error('Không thấy bài viết nào');
    res.status(200).json({ data: { post } });
  } catch (error) {
    next(error);
  }
};
exports.getLikePost = async (req, res, next) => {
  try {
    let postId = req.params.id;
    const post = await Post.findByPk(postId);
    if (!post || _.get(post, 'isBlock', false) === true)
      throw new api404Error('Không thấy bài viết nào');
    const likesPost = await LikePost.findAll({
      where: { postId },
    });
    const length = await LikePost.count({ where: { postId } });
    res.status(200).json({ data: likesPost, length });
  } catch (error) {
    next(error);
  }
};
// like a post
exports.like = async (req, res, next) => {
  try {
    const postId = req.params.id;
    let UserId = req.user.id;
    if (req.user.isBlockInteration) {
      const ttl = await redis.getTTL(
        `BLOCK_INTERACTION_USER_ID_${req.user.id}`
      );
      throw new api401Error(`Bạn bị cấm tương tác trong ${format(ttl)}`);
    }
    let post = await Post.findByPk(postId);
    if (!post || _.get(post, 'isBlock', false) === true)
      throw new api404Error('Không thấy bài viết nào');
    let likedPost = await LikePost.findAll({
      where: {
        postId,
        UserId,
      },
    });
    if (likedPost.length === 0) {
      await LikePost.create({ postId, UserId });
      // await alertInteraction({ userId: req.user.id });
      res.status(200).json({ message: 'bạn đã thích thành công' });
    } else {
      await LikePost.destroy({ where: { postId, UserId } });
      res.status(200).json({ message: 'bạn đã bỏ thích thành công' });
    }
    await alertInteraction({ userId: req.user.id });
  } catch (error) {
    next(error);
  }
};
exports.report = async (req, res, next) => {
  try {
    const postId = req.params.id;
    let userId = req.user.id;
    let post = await Post.findByPk(postId);
    if (!post || _.get(post, 'isBlock', false) === true)
      throw new api404Error('Không thấy bài viết nào');
    let reportPost = await ReportPost.findAll({
      where: {
        postId,
        userId,
      },
    });
    if (reportPost.length === 0) {
      await ReportPost.create({ postId, userId });
      res.status(200).json({ message: 'bạn đã báo cáo thành công' });
    } else {
      res.status(200).json({ message: 'bạn đã  báo cáo rồi' });
    }
  } catch (error) {
    next(error);
  }
};
// ! đã có bên controller Comment comment a post
// exports.createComment = async (req, res, next) => {
//   try {
//     const {postId, text} = req.body;
//     let userId = req.user.id;
//     let post = await Post.findByPk(postId);
//     if (!post) throw new api404Error('Không thấy bài viết');
//     await CommentPost.create({ postId, userId, text });
//     res.status(204).json();
//   } catch (error) {
//     next(error);
//   }
// };

// query post count report
exports.countLike = async (req, res, next) => {
  try {
    const postId = req.params.id;
    let UserId = req.user.id;
  } catch (error) {
    next(error);
  }
};
// get posts timeline
// exports.getTimeLine = async (req, res, next) => {
//   try {
//     const userId = req.user.id;
//     const userPost = await Post.findAll({ where: { userId, isBlock: false }, raw: true });
//     // console.log(userPost);
//     const friends = await sequelize.query(
//       `select followedId, fullName, profilePicture from Followers fw
//       join Users  u on fw.followedId = u.id WHERE isBlock = false  and fw.followingId = ${userId}`,
//       {
//         type: QueryTypes.SELECT,
//       }
//     );
//     // console.log(friends);
//     const friendPosts = await Promise.all(
//       friends.map(async (friend) => {
//         return Post.findAll({
//           where: { userId: friend.followedId, isBlock: false },
//           raw: true,
//         });
//       })
//     );

//     // console.log(friendPosts);
//     let data = userPost.concat(...friendPosts);
//     _.forEach(data, (item) => {
//       const friend = _.find(friends, { followedId: item.userId });
//       if (friend) {
//         // _.set(item, 'profilePicture', friend.profilePicture);
//         // _.set(item, 'fullName', friend.fullName);
//         item.profilePicture = _.get(friend, 'profilePicture', '');
//         item.fullName = _.get(friend, 'fullName', '');
//       } else {
//         item.profilePicture = _.get(req.user, 'profilePicture', '');
//         item.fullName = _.get(req.user, 'fullName', '');
//       }
//       console.log(item);
//     });
//     data = await Promise.all(
//       data.map(async (p) => {
//         numLike = await LikePost.count({
//           where: {
//             postId: p.id,
//           },
//         });
//         numComment = await CommentPost.count({
//           where: {
//             postId: p.id,
//           },
//         });
//         return { ...p, numLike, numComment };
//       })
//     );
//     data.sort((p1, p2) => {
//       return new Date(p2.createdAt) - new Date(p1.createdAt);
//     });

//     res.status(200).json({ data });
//   } catch (error) {
//     next(error);
//   }
// };
exports.queryTimeLine = async (req, res, next) => {
  try {
    const userId = req.user.id;
    console.log(req.query);
    const page = parseInt(_.get(req, 'query.page', 0));

    console.log(page);
    let limit = +req.query.limit || 10;
    let offset = 0 + page * limit;
    console.log('offset', offset);
    // const sort = req.query.sort || SORT.REPORT;
    const friends = await sequelize.query(
      `select followedId, fullName, profilePicture from Followers fw
      join Users  u on fw.followedId = u.id WHERE isBlock = false  and fw.followingId = ${userId}`,
      {
        type: QueryTypes.SELECT,
      }
    );

    const groupUserJoined = await GroupMember.findAll({
      where: {
        userId,
        state: GeneralConstants.STATE_MEMBER.APPROVED,
      },
    });

    const groupIds = groupUserJoined.map((item) => item.groupId);
    const friendIds = friends.map((friend) => friend.followedId);
    friendIds.push(userId);

    const posts = await Post.findAll({
      subQuery: false,
      where: {
        [Op.or]: {
          userId: {
            [Op.in]: friendIds,
          },
          groupId: {
            [Op.in]: groupIds,
          },
        },
        isBlock: false,
      },
      attributes: {
        include: [
          [sequelize.literal('COUNT(DISTINCT(LikePosts.id))'), 'numLike'],
          [sequelize.literal('COUNT(DISTINCT(CommentPosts.id))'), 'numComment'],
        ],
      },
      include: [
        {
          model: LikePost,
          attributes: [],
        },
        {
          association: 'group',
          attributes: ['title'],
          // required: true,
        },
        {
          model: CommentPost,
          attributes: [],
        },
        {
          association: 'user',
          attributes: ['fullName', 'id', 'username', 'profilePicture'],
        },
      ],
      order: [['id', 'DESC']],
      group: 'id',
      limit,
      offset,
      raw: true,
      nest: true,
    });

    const postIds = posts.map((post) => post.id);

    const userLikePosts = await LikePost.findAll({
      where: {
        postId: {
          [Op.in]: postIds,
        },
        UserId: userId,
      },
      attributes: ['postId'],
    });

    const userLikePostIds = userLikePosts.map((item) => item.postId);
    const postsAddIsLiked = posts.map((post) => {
      let isLiked = false;
      if (userLikePostIds.includes(post.id)) isLiked = true;
      return {
        ...post,
        isLiked,
      };
    });

    res.status(200).json({ data: postsAddIsLiked });
  } catch (error) {
    next(error);
  }
};
exports.queryTimeLineGroup = async (req, res, next) => {
  try {
    const userId = req.user.id;
    console.log(req.query);
    const page = parseInt(_.get(req, 'query.page', 0));
    const groupId = req.query.groupId;
    console.log(page);
    let limit = +req.query.limit || 10;
    let offset = 0 + page * limit;
    console.log('offset', offset);
   
    let where = {
      userId,
      state: GeneralConstants.STATE_MEMBER.APPROVED,
    };
    if (groupId) where.groupId = groupId;
    const groupUserJoined = await GroupMember.findAll({
      where,
    });
    const groupIds = groupUserJoined.map((item) => item.groupId);
   
    const posts = await Post.findAll({
      subQuery: false,
      where: {
        groupId: {
          [Op.in]: groupIds,
        },
        isBlock: false,
      },
      attributes: {
        include: [
          [sequelize.literal('COUNT(DISTINCT(LikePosts.id))'), 'numLike'],
          [sequelize.literal('COUNT(DISTINCT(CommentPosts.id))'), 'numComment'],
        ],
      },
      include: [
        {
          model: LikePost,
          attributes: [],
        },
        {
          association: 'group',
          attributes: ['title'],
          required: true,
        },
        {
          model: CommentPost,
          attributes: [],
        },
        {
          association: 'user',
          attributes: ['fullName', 'id', 'username', 'profilePicture'],
        },
      ],
      order: [['id', 'DESC']],
      group: 'id',
      limit,
      offset,
      raw: true,
      nest: true,
    });

    const postIds = posts.map((post) => post.id);

    const userLikePosts = await LikePost.findAll({
      where: {
        postId: {
          [Op.in]: postIds,
        },
        UserId: userId,
      },
      attributes: ['postId'],
    });

    const userLikePostIds = userLikePosts.map((item) => item.postId);
    const postsAddIsLiked = posts.map((post) => {
      let isLiked = false;
      if (userLikePostIds.includes(post.id)) isLiked = true;
      return {
        ...post,
        isLiked,
      };
    });

    res.status(200).json({ data: postsAddIsLiked });
  } catch (error) {
    next(error);
  }
};

// search(req, res) {
//   try{
//       const result = await es.search({
//           index: 'articles',
//           type: 'articles',
//           q: req.query.q
//       })

//       const ids = result.hits.hits.map((item) => {
//           return item._id
//       })

//       articles = await Article.findAll({
//           where: {
//               id: ids
//           }
//       })
//        res.send(articles)
//   }
//   catch(err){
//       res.status(500).send({
//           error: 'An error has occured trying to get the articles'
//       })
//   }
// }
// * query cho search gồm có tìm bạn bè, bài viết
exports.query = async (req, res, next) => {
  try {
    const userId = req.user.id;
    console.log(req.query);
    const page = parseInt(_.get(req, 'query.page', 0));

    console.log(page);
    let limit = +req.query.limit || 10;
    let offset = 0 + page * limit;
    console.log('offset', offset);
    let textSearch = req.query.textSearch;
    // const sort = req.query.sort || SORT.REPORT;

    let wherePost = {};

    const result = await client.search({
      index: 'posts',
      type: 'posts',
      body: {
        query: {
          match: { description: textSearch },
        },
      },
    });
    // console.log(JSON.stringify(result.hits.hits));

    const ids = result.hits.hits.map((item) => {
      return item._id;
    });
    console.log(ids);
    wherePost = {
      // description: {
      //   [Op.like]: `%${textSearch}%`,
      // },
      id: {
        [Op.in]: ids,
      },
    };
    const posts = await Post.findAll({
      subQuery: false,
      where: {
        ...wherePost,
        isBlock: false,
      },
      attributes: {
        include: [
          [sequelize.literal('COUNT(DISTINCT(LikePosts.id))'), 'numLike'],
          [sequelize.literal('COUNT(DISTINCT(CommentPosts.id))'), 'numComment'],
        ],
      },
      include: [
        {
          model: LikePost,
          attributes: [],
        },
        {
          model: CommentPost,
          attributes: [],
        },
        {
          association: 'user',
          attributes: ['fullName', 'id', 'username', 'profilePicture'],
        },
      ],
      order: [['createdAt', 'DESC']],
      group: 'id',
      limit,
      offset,
    });
    const length = await Post.count({
      where: {
        ...wherePost,
        isBlock: false,
      },
    });
    res.status(200).json({ data: posts, length });
  } catch (error) {
    next(error);
  }
};
//get posts on profile
exports.getProfilePost = async (req, res, next) => {
  try {
    const username = req.params.username;
    const page = parseInt(_.get(req, 'query.page', 0));

    console.log(page);
    let limit = +req.query.limit || 10;
    let offset = 0 + page * limit;
    const user = await User.findOne({ where: { username } });
    const posts = await Post.findAll({
      subQuery: false,
      attributes: {
        include: [
          [sequelize.literal('COUNT(DISTINCT(LikePosts.id))'), 'numLike'],
          [sequelize.literal('COUNT(DISTINCT(CommentPosts.id))'), 'numComment'],
        ],
      },
      where: { userId: user.id, isBlock: false, groupId: null },
      limit,
      offset,
      include: [
        {
          model: LikePost,
          attributes: [],
        },
        {
          model: CommentPost,
          attributes: [],
        },
        {
          association: 'user',
          attributes: ['fullName', 'id', 'username', 'profilePicture'],
        },
      ],
      order: [['createdAt', 'DESC']],
      group: 'id',
      raw: true,
      nest: true,
    });

    const postIds = posts.map((post) => post.id);

    const userLikePosts = await LikePost.findAll({
      where: {
        postId: {
          [Op.in]: postIds,
        },
        UserId: req.user.id,
      },
      attributes: ['postId'],
    });

    const userLikePostIds = userLikePosts.map((item) => item.postId);
    const postsAddIsLiked = posts.map((post) => {
      let isLiked = false;
      if (userLikePostIds.includes(post.id)) isLiked = true;
      return {
        ...post,
        isLiked,
      };
    });

    res.status(200).json({ data: postsAddIsLiked });
  } catch (error) {
    next(error);
  }
};
