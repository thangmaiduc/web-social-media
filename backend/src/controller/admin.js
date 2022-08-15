const api401Error = require('../utils/errors/api401Error');
const api404Error = require('../utils/errors/api404Error');
const api400Error = require('../utils/errors/api400Error');
const User = require('../models/').User;
const Post = require('../models/').Post;
const LikePost = require('../models/').LikePost;
const CommentPost = require('../models/').CommentPost;
const ReportPost = require('../models/').ReportPost;
const ReportUser = require('../models/').ReportUser;
const sequelize = require('../models/').sequelize;
const { QueryTypes, Op } = require('sequelize');
const _ = require('lodash');
const moment = require('moment');
const { SORT } = require('../GeneralConstants');

// * statisDashboard
exports.statisDashboard = async (req, res, next) => {
  try {
    const startOfMonth = moment().startOf('month').format('YYYY-MM-DD hh:mm');
    const endOfMonth = moment().endOf('month').format('YYYY-MM-DD hh:mm');
    const where = { createdAt: { [Op.between]: [startOfMonth, endOfMonth] } };
    let numUserMonth = await User.count({
      where,
    });
    let numPostMonth = await Post.count({
      where,
    });
    let numCommentMonth = await CommentPost.count({
      where,
    });
    let numLikeMonth = await LikePost.count({
      where,
    });
    let numUser = await User.count({});
    let numPost = await Post.count({});
    let numComment = await CommentPost.count({});
    let numLike = await LikePost.count({});
    
    res.json({
      data: {
        numUser,
        numPost,
        numInteraction: numComment+numLike,
        numUserMonth,
        numPostMonth,
        numInteractionMonth: numCommentMonth+numLikeMonth,
      },
    });
  } catch (error) {
    next(error);
  }
};
exports.queryUser = async (req, res, next) => {
  try {
    const startOfMonth = moment().startOf('month').format('YYYY-MM-DD hh:mm');
    const endOfMonth = moment().endOf('month').format('YYYY-MM-DD hh:mm');
    const page = parseInt(req.query.page, 0);
    let limit = +req.query.limit || 10;
    let offset = 0 + page * limit;
    let textSearch = req.query.textSearch;
    const sort = req.query.sort || SORT.REPORT;
    const direction = req.query.direction || 'desc';

    const order = [];
    const where = {};
    const orderDESC = [
      [sequelize.literal('COUNT(DISTINCT(Reported.id))'), 'DESC'],
      [sequelize.literal('COUNT(DISTINCT(posts.id))'), 'DESC'],
      ['id', 'DESC'],
      ['isBlock', 'DESC'],
      [sequelize.literal('COUNT(DISTINCT(Followed.id))'), 'DESC'],
      [sequelize.literal('COUNT(DISTINCT(Following.id))'), 'DESC'],
      ['fullName', 'DESC'],
    ];
    const orderASC = [
      [sequelize.literal('COUNT(DISTINCT(Reported.id))'), 'ASC'],
      [sequelize.literal('COUNT(DISTINCT(posts.id))'), 'ASC'],
      ['id', 'ASC'],
      ['isBlock', 'ASC'],
      [sequelize.literal('COUNT(DISTINCT(Followed.id))'), 'ASC'],
      [sequelize.literal('COUNT(DISTINCT(Following.id))'), 'ASC'],
      ['fullName', 'ASC'],
    ];
    if (sort === SORT.REPORT && _.upperCase(direction) === 'DESC') {
      order.push(orderDESC[0]);
      order.push(orderASC[2]);
    } else if (sort === SORT.REPORT && _.upperCase(direction) === 'ASC') {
      order.push(orderASC[0]);
      order.push(orderASC[2]);
    }
    if (sort === SORT.POST && _.upperCase(direction) === 'DESC') {
      order.push(orderDESC[1]);
      order.push(orderASC[2]);
    } else if (sort === SORT.POST && _.upperCase(direction) === 'ASC') {
      order.push(orderASC[1]);
      order.push(orderASC[2]);
    }
    if (sort === SORT.FOLLOWED && _.upperCase(direction) === 'DESC') {
      order.push(orderDESC[4]);
      order.push(orderASC[2]);
    } else if (sort === SORT.FOLLOWED && _.upperCase(direction) === 'ASC') {
      order.push(orderASC[4]);
      order.push(orderASC[2]);
    }
    if (sort === SORT.FOLLOWING && _.upperCase(direction) === 'DESC') {
      order.push(orderDESC[5]);
      order.push(orderASC[2]);
    } else if (sort === SORT.FOLLOWING && _.upperCase(direction) === 'ASC') {
      order.push(orderASC[5]);
      order.push(orderASC[2]);
    }
    if (sort === SORT.FULLNAME && _.upperCase(direction) === 'DESC') {
      order.push(orderDESC[6]);
    } else if (sort === SORT.FULLNAME && _.upperCase(direction) === 'ASC') {
      order.push(orderASC[6]);
    }
    if (sort === SORT.FOLLOWING && _.upperCase(direction) === 'DESC') {
      order.push(orderDESC[5]);
      order.push(orderASC[2]);
    } else if (sort === SORT.FOLLOWING && _.upperCase(direction) === 'ASC') {
      order.push(orderASC[5]);
      order.push(orderASC[2]);
    }
    if (sort === SORT.USERID && _.upperCase(direction) === 'DESC') {
      order.push(orderDESC[2]);
    } else if (sort === SORT.USERID && _.upperCase(direction) === 'ASC') {
      order.push(orderASC[2]);
    }
    if (sort === SORT.STATUS && _.upperCase(direction) === 'DESC') {
      order.push(orderDESC[3]);
      order.push(orderASC[2]);
    } else if (sort === SORT.STATUS && _.upperCase(direction) === 'ASC') {
      order.push(orderASC[3]);
      order.push(orderASC[2]);
    }
    if (sort !== SORT.STATUS) where.isBlock = false;
    if (!_.isEmpty(textSearch)) {
      where[Op.or] = {
        fullName: {
          [Op.like]: `%${textSearch}%`,
        },
        id: {
          [Op.like]: textSearch,
        },
        username: {
          [Op.like]: `%${textSearch}%`,
        },
      };
    }
    const result = await User.findAll({
      subQuery: false,
      where,
      attributes: {
        include: [
          [sequelize.literal('COUNT(DISTINCT(Reported.id))'), 'numReport'],
          [sequelize.literal('COUNT(DISTINCT(posts.id))'), 'numPost'],
          [sequelize.literal('COUNT(DISTINCT(Followed.id))'), 'numFollowed'],
          [sequelize.literal('COUNT(DISTINCT(Following.id))'), 'numFollowing'],
        ],
        exclude: ['password'],
      },
      include: [
        {
          association: 'Reported',
          attributes: [],
        },
        {
          association: 'Followed',
          attributes: [],
        },
        {
          association: 'Following',
          attributes: [],
        },

        // * chọn liên kết nào, với 'as'
        {
          association: 'posts',
          attributes: [],
        },
      ],

      group: 'id',
      order,
      offset,
      limit,
    });
    length = await User.count({
      where,
    });

    res.json({
      data: result,
      length,
    });
  } catch (error) {
    next(error);
  }
};
// TODO: query ra người dùng có nhiều hoạt động nhất
// TODO: query ra người dùng không có hoạt động
// TODO: thống kê  bài viết có nhiều tương tác nhất(like or comment)
exports.queryPost = async (req, res, next) => {
  try {
    const startOfMonth = moment().startOf('month').format('YYYY-MM-DD hh:mm');
    const endOfMonth = moment().endOf('month').format('YYYY-MM-DD hh:mm');
    console.log('req.params', req.params);
    console.log(req.query);
    const page = parseInt(req.query.page, 0);
    console.log(page);
    let limit = +req.query.limit || 10;
    let offset = 0 + page * limit;
    console.log('offset', offset);
    const sort = req.query.sort || SORT.REPORT;
    const direction = req.query.direction || 'DESC';

    const order = [];
    const where = {};
    const orderDESC = [
      [sequelize.literal('COUNT(DISTINCT(ReportPosts.id))'), 'DESC'],
      [sequelize.literal('COUNT(DISTINCT(LikePosts.id))'), 'DESC'],
      ['id', 'DESC'],
      ['isBlock', 'DESC'],
      [sequelize.literal('COUNT(DISTINCT(CommentPosts.id))'), 'DESC'],
    ];
    const orderASC = [
      [sequelize.literal('COUNT(DISTINCT(ReportPosts.id))'), 'ASC'],
      [sequelize.literal('COUNT(DISTINCT(LikePosts.id))'), 'ASC'],
      ['id', 'ASC'],
      ['isBlock', 'ASC'],
      [sequelize.literal('COUNT(DISTINCT(CommentPosts.id))'), 'ASC'],
    ];
    if (sort === SORT.REPORT && _.upperCase(direction) === 'DESC') {
      order.push(orderDESC[0]);
      order.push(orderASC[1]);
      order.push(orderASC[2]);
    } else if (sort === SORT.REPORT && _.upperCase(direction) === 'ASC') {
      order.push(orderASC[0]);
      order.push(orderDESC[1]);
      order.push(orderDESC[2]);
    }

    if (sort === SORT.LIKE && _.upperCase(direction) === 'DESC') {
      order.push(orderDESC[1]);
      order.push(orderASC[2]);
    } else if (sort === SORT.LIKE && _.upperCase(direction) === 'ASC') {
      order.push(orderASC[1]);
      order.push(orderASC[2]);
    }
    if (sort === SORT.POSTID && _.upperCase(direction) === 'DESC') {
      order.push(orderDESC[2]);
    } else if (sort === SORT.POSTID && _.upperCase(direction) === 'ASC') {
      order.push(orderASC[2]);
    }
    if (sort === SORT.COMMENT && _.upperCase(direction) === 'DESC') {
      order.push(orderDESC[4]);
    } else if (sort === SORT.COMMENT && _.upperCase(direction) === 'ASC') {
      order.push(orderASC[4]);
    }
    if (sort === SORT.STATUS && _.upperCase(direction) === 'DESC') {
      order.push(orderDESC[3]);
      order.push(orderASC[2]);
    } else if (sort === SORT.STATUS && _.upperCase(direction) === 'ASC') {
      order.push(orderASC[3]);
      order.push(orderASC[2]);
    }
    if (sort !== SORT.STATUS) where.isBlock = false;
    const result = await Post.findAll({
      subQuery: false,
      where,
      attributes: {
        include: [
          [sequelize.literal('COUNT(DISTINCT(ReportPosts.id))'), 'numReport'],
          [sequelize.literal('COUNT(DISTINCT(LikePosts.id))'), 'numLike'],
          [sequelize.literal('COUNT(DISTINCT(CommentPosts.id))'), 'numComment'],
        ],
      },
      include: [
        {
          model: ReportPost,
          attributes: [],
        },
        {
          model: LikePost,
          attributes: [],
        },
        {
          model: CommentPost,
          attributes: [],
        },
        // * chọn liên kết nào, với 'as'
        {
          association: 'user',
          attributes: ['fullName', 'id', 'username', 'profilePicture'],
        },
      ],

      group: 'id',
      order,
      offset,
      limit,
    });
    length = await Post.count({
      where,
    });
    res.json({
      data: result,
      length,
    });
  } catch (error) {
    next(error);
  }
};
// TODO: query ra người dùng có nhiều hoạt động nhất
// TODO: query ra người dùng không có hoạt động
// TODO: thống kê  bài viết có nhiều tương tác nhất(like or comment)
exports.blockPost = async (req, res, next) => {
  try {
    let postId = req.body.postId;
    let post = await Post.findByPk(postId);
    if (!post) throw new api404Error('không tìm thấy bài viết');
    if (post.isBlock === true) {
      post.isBlock = false;
      // throw new api404Error('Bài viết đã bị chặn');
    } else if (post.isBlock === false) {
      post.isBlock = true;
    }
    await post.save();
    res.status(200).json({ data: post });
  } catch (error) {
    next(error);
  }
};
exports.blockUser = async (req, res, next) => {
  try {
    let userId = req.body.userId;
    let user = await User.findByPk(userId);
    if (!user) throw new api404Error('không tìm thấy người dùng');
    if (user.isBlock === true) {
      // throw new api404Error('Người dùng đã bị chặn');
      user.isBlock = false;
    } else if (user.isBlock === false) {
      user.isBlock = true;
      const posts = await Post.update(
        {
          isBlock: true,
        },
        {
          where: { userId },
        }
      );
    }

    await user.save();
    res.status(200).json({ data: user });
  } catch (error) {
    next(error);
  }
};
