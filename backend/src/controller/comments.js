const api401Error = require('../utils/errors/api401Error');
const api404Error = require('../utils/errors/api404Error');
const api400Error = require('../utils/errors/api400Error');
const CommentPost = require('../models').CommentPost;
const Post = require('../models').Post;
const User = require('../models/').User;
const sequelize = require('../models').sequelize;
const { QueryTypes } = require('sequelize');
const _ = require('lodash');
const alertInteraction = require('../utils/alertInteraction');
require('moment-duration-format');
const moment = require('moment');
const redis = require('../utils/redis');
const { format } = require('../utils/time');

// * create
exports.create = async (req, res, next) => {
  try {
    let { postId, text } = req.body;
    if (req.user.isBlockInteration) {
      const ttl = await redis.getTTL(`BLOCK_INTERACTION_USER_ID_${req.user.id}`);
      throw new api401Error(`Bạn bị cấm tương tác trong ${format(ttl)}`);
    }
    let checkPost = await Post.findByPk(postId);
    if (!checkPost || _.get(checkPost, 'isBlock', false) === true) throw new api404Error('Không thấy bài viết');
    let comment = await CommentPost.create({
      postId,
      text,
      userId: req.user.id,
    });

    const newComment = await CommentPost.findOne({
      where: { id: comment.id },
      include: [
        {
          model: User,
          as: 'user',
          required: true,
          attributes: ['profilePicture', 'fullName', 'username'],
        },
      ],
    });
    res.status(201).json({ data: newComment });
    await alertInteraction({ userId: req.user.id });
  } catch (error) {
    next(error);
  }
};
// * update
exports.update = async (req, res, next) => {
  const updates = Object.keys(req.body);
  const allowsUpdate = ['text'];

  const isValidUpdate = updates.every((update) => allowsUpdate.includes(update));
  try {
    if (!isValidUpdate) {
      throw new api400Error('Thay đổi không hợp lệ"');
    }
    let id = req.params.id;
    const comment = await CommentPost.findByPk(id);

    if (comment.userId === req.user.id || true) {
      updates.forEach((update) => (comment[update] = req.body[update]));
      comment.save();
      const editComment = await CommentPost.findOne({
        where: { id: comment.id },
        include: [
          {
            model: User,
            as: 'user',
            required: true,
            attributes: ['profilePicture', 'fullName', 'username'],
          },
        ],
      });
      res.status(200).json({ data: editComment });
    } else {
      res.status(403).json({ message: 'Sửa bình luận thất bại' });
    }
  } catch (error) {
    next(error);
  }
};
// * delete a post
exports.delete = async (req, res, next) => {
  try {
    let id = req.params.id;
    const commentPost = await CommentPost.findByPk(id);
    const post = await Post.findByPk(commentPost.postId);

    if (commentPost.userId === req.user.id || req.user.isAdmin === true || req.user.id === post.userId) {
      await commentPost.destroy();
      res.status(204).json();
    } else {
      res.status(403).json({ message: 'bạn không thể xoá bình luận này' });
    }
  } catch (error) {
    next(error);
  }
};

// *   get a post'comments
exports.getCommentsPost = async (req, res, next) => {
  try {
    let postId = req.params.postId;
    const page = _.get(req, 'query.page', 0);
    let limit = +req.query.limit || 5;
    let offset = 0 + page * limit;
    const post = await Post.findByPk(postId);
    if (!post || _.get(post, 'isBlock', false) === true) throw new api404Error('Không thấy bài viết nào');
    const commentsPost = await CommentPost.findAll({
      where: { postId },
      include: [
        {
          model: User,
          as: 'user',
          required: true,
          attributes: ['profilePicture', 'fullName', 'username'],
        },
      ],
      order: [['createdAt', 'DESC']],
      limit,
      offset,
    });
    const length = await CommentPost.count({ where: { postId } });
    res.status(200).json({ data: commentsPost, length });
  } catch (error) {
    next(error);
  }
};
// *  query comment
exports.queryComments = async (req, res, next) => {
  try {
    let postId = req.body.postId;
    let { limit, page } = req.body;
    const post = await Post.findByPk(postId);
    if (!post || _.get(post, 'isBlock', false) === true) throw new api404Error('Không thấy bài viết nào');
    const commentsPost = await CommentPost.findAll({
      where: { postId },
      include: [
        {
          model: User,
          as: 'user',
          required: true,
          attributes: ['profilePicture', 'fullName', 'username'],
        },
      ],
      order: ['createdAt'],
      limit,
    });
    res.status(200).json({ data: { commentsPost } });
  } catch (error) {
    next(error);
  }
};
