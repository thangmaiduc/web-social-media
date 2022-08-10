const api401Error = require('../utils/errors/api401Error');
const api404Error = require('../utils/errors/api404Error');
const api400Error = require('../utils/errors/api400Error');
const User = require('../models/').User;
const Post = require('../models/').Post;
const LikePost = require('../models/').LikePost;
const CommentPost = require('../models/').CommentPost;
const sequelize = require('../models/').sequelize;
const { QueryTypes, Op } = require('sequelize');
const _ = require('lodash');
const moment = require('moment');

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
        numCommentMonth
      },
    });
  } catch (error) {
    next(error);
  }
};
exports.queryUser = async (req, res, next) => {
  try {
    const startOfMonth = moment().startOf('month').format('YYYY-MM-DD hh:mm');
    let numUser = await User.count({
      where: { createdAt: { [Op.gte]: startOfMonth } },
    });
    let numPost = await Post.count({
      where: { createdAt: { [Op.gte]: startOfMonth } },
    });
    let numComment = await CommentPost.count({
      where: { createdAt: { [Op.gte]: startOfMonth } },
    });
    // TODO: thống kê số người dùng tạo hằng tháng
    // TODO: thống kê số bài viết tạo hằng ngày
    // TODO: thống kê lượt tương tác hằng ngày
    res.json({
      data: {
        numUser,
        numPost,
        numComment,
      },
    });
  } catch (error) {
    next(error);
  }
};
// TODO: query ra người dùng có nhiều hoạt động nhất
// TODO: thống kê  bài viết có nhiều tương tác nhất(like or comment)
