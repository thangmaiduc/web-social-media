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
    let numUserMonth = await User.count({
      where: { createdAt: { [Op.gte]: startOfMonth } },
    });
    let numPostMonth = await Post.count({
      where: { createdAt: { [Op.gte]: startOfMonth } },
    });
    let numCommentMonth = await CommentPost.count({
      where: { createdAt: { [Op.gte]: startOfMonth } },
    });
    let numUser = await User.count({});
    let numPost = await Post.count({});
    let numComment = await CommentPost.count({});
    // let numPostMonth = await Post.count({});
    // let numCommentMonth = await CommentPost.count({});
    // TODO: thống kê số người dùng tạo hằng tháng
    // TODO: thống kê số bài viết tạo hằng ngày
    // TODO: thống kê lượt tương tác hằng ngày
    res.json({
      data: {
        numUser,
        numPost,
        numComment,
        numUserMonth,
        numPostMonth,
        numCommentMonth,
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
    const page = +req.params.page || 1;
    let limit = 10;
    let offset = 0 + (page - 1) * limit;
    const sort = req.query.sort || SORT.REPORT;
    const direction = req.query.direction || 'DESC';

    const order = [];
    const where = {};
    const orderDESC = [
      [sequelize.literal('COUNT(DISTINCT(Reported.id))'), 'DESC'],
      [(sequelize.fn('COUNT', sequelize.col('posts.id')), 'DESC')],
      ['id', 'DESC'],
      ['isBlock', 'DESC'],
    ];
    const orderASC = [
      [sequelize.literal('COUNT(DISTINCT(Reported.id))'), 'ASC'],
      [(sequelize.fn('COUNT', sequelize.col('posts.id')), 'ASC')],
      ['id', 'ASC'],
      ['isBlock', 'ASC'],
    ];
    if (sort === SORT.REPORT && direction === 'DESC') {
      order.push(orderDESC[0]);
      order.push(orderASC[2]);
    } else if (sort === SORT.REPORT && direction === 'ASC') {
      order.push(orderASC[0]);
      order.push(orderASC[2]);
    }
    if (sort === SORT.USERID && direction === 'DESC') {
      order.push(orderDESC[2]);
    } else if (sort === SORT.USERID && direction === 'ASC') {
      order.push(orderASC[2]);
    }
    if (sort === SORT.STATUS && direction === 'DESC') {
      order.push(orderDESC[3]);
      order.push(orderASC[2]);
    } else if (sort === SORT.STATUS && direction === 'ASC') {
      order.push(orderASC[3]);
      order.push(orderASC[2]);
    }
    if (sort !== SORT.STATUS) where.isBlock = false;
    const result = await User.findAll({
      subQuery: false,
      where,
      attributes: {
        include: [
          [sequelize.fn('COUNT', sequelize.col('posts.id')), 'numPost'],
          // [sequelize.fn('COUNT', sequelize.col('Reported.id')), 'numReport'],
          [sequelize.literal('COUNT(DISTINCT(Reported.id))'), 'numReport'],
        ],
        exclude: ['password'],
      },
      include: [
        {
          association: 'Reported',
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
    length = _.isArray(result) === true ? result.length : 0;

    res.json({
      data: result,
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

    const page = +req.params.page || 1;
    let limit = 10;
    let offset = 0 + (page - 1) * limit;
    const sort = req.query.sort || SORT.REPORT;
    const direction = req.query.direction || 'DESC';

    const order = [];
    const where = {};
    const orderDESC = [
      [sequelize.fn('COUNT', sequelize.col('ReportPosts.id')), 'DESC'],
      [sequelize.fn('COUNT', sequelize.col('LikePosts.id')), 'DESC'],
      // [sequelize.fn('COUNT', sequelize.col('CommentPosts.id')), 'DESC'],
      ['id', 'DESC'],
      ['isBlock', 'DESC'],
    ];
    const orderASC = [
      [sequelize.fn('COUNT', sequelize.col('ReportPosts.id')), 'ASC'],
      [sequelize.fn('COUNT', sequelize.col('LikePosts.id')), 'ASC'],
      // [sequelize.fn('COUNT', sequelize.col('CommentPosts.id')), 'ASC'],
      ['id', 'ASC'],
      ['isBlock', 'ASC'],
    ];
    if (sort === SORT.REPORT && direction === 'DESC') {
      order.push(orderDESC[0]);
      order.push(orderASC[1]);
      order.push(orderASC[2]);
    } else if (sort === SORT.REPORT && direction === 'ASC') {
      order.push(orderASC[0]);
      order.push(orderDESC[1]);
      order.push(orderDESC[2]);
    }

    if (sort === SORT.LIKE && direction === 'DESC') {
      order.push(orderDESC[1]);
      order.push(orderASC[2]);
    } else if (sort === SORT.LIKE && direction === 'ASC') {
      order.push(orderASC[1]);
      order.push(orderASC[2]);
    }
    if (sort === SORT.POSTID && direction === 'DESC') {
      order.push(orderDESC[2]);
    } else if (sort === SORT.POSTID && direction === 'ASC') {
      order.push(orderASC[2]);
    }
    if (sort === SORT.STATUS && direction === 'DESC') {
      order.push(orderDESC[3]);
    } else if (sort === SORT.STATUS && direction === 'ASC') {
      order.push(orderASC[3]);
    }
    if (sort !== SORT.STATUS) where.isBlock = false;
    const result = await Post.findAll({
      subQuery: false,
      where,
      attributes: {
        include: [
          [sequelize.fn('COUNT', sequelize.col('ReportPosts.id')), 'numReport'],
          [sequelize.fn('COUNT', sequelize.col('LikePosts.id')), 'numLike'],
          [
            sequelize.fn('COUNT', sequelize.col('CommentPosts.id')),
            'numComment',
          ],
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
    length = _.isArray(result) === true ? result.length : 0;
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
    if (post.isBlock === true) throw new api404Error('Bài viết đã bị chặn');
    post.isBlock = true;
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
    if (user.isBlock === true) throw new api404Error('Người dùng đã bị chặn');
    user.isBlock = true;
    const posts = await Post.update(
      {
        isBlock: true,
      },
      {
        userId,
      }
    );
    await user.save();
    res.status(200).json({ data: user });
  } catch (error) {
    next(error);
  }
};
