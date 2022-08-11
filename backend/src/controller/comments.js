const api401Error = require('../utils/errors/api401Error');
const api404Error = require('../utils/errors/api404Error');
const api400Error = require('../utils/errors/api400Error');
const CommentPost = require('../models').CommentPost;
const Post = require('../models').Post;
const User = require('../models/').User;
const sequelize = require('../models').sequelize;
const { QueryTypes } = require('sequelize');
const _ = require('lodash');
// * create
exports.create = async (req, res, next) => {
  try {
    let { postId, text } = req.body;
    let checkPost = await Post.findByPk(postId);
    if (!checkPost || _.get(checkPost, 'isBlock', false)===true) throw new api404Error('Không thấy bài viết');
    let comment = await CommentPost.create({
      postId,
      text,
      userId: req.user.id,
    });
    console.log(comment);
    res.json({ message: 'thành công' });
  } catch (error) {
    next(error);
  }
};
// * update
exports.update = async (req, res, next) => {
  const updates = Object.keys(req.body);
  const allowsUpdate = ['text'];

  const isValidUpdate = updates.every((update) =>
    allowsUpdate.includes(update)
  );
  try {
    if (!isValidUpdate) {
      throw new api400Error('Thay đổi không hợp lệ"');
    }
    let id = req.params.id;
    const comment = await CommentPost.findByPk(id);

    if (comment.userId === req.user.id) {
      updates.forEach((update) => (comment[update] = req.body[update]));
      comment.save();
      res.status(200).json({ message: 'Sửa bình luận thành công' });
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

    if (
      commentPost.userId === req.user.id ||
      req.user.isAdmin === true ||
      req.user.id === post.userId
    ) {
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
    let postId = req.body.postId;
    const post = await Post.findByPk(postId);
    if (!post || _.get(post, 'isBlock', false)===true) throw new api404Error('Không thấy bài viết nào');
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
    });
    res.status(200).json({ data: commentsPost });
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
    if (!post || _.get(post, 'isBlock', false)===true) throw new api404Error('Không thấy bài viết nào');
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
