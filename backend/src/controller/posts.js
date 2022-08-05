const api401Error = require('../utils/errors/api401Error');
const api404Error = require('../utils/errors/api404Error');
const api400Error = require('../utils/errors/api400Error');
const User = require('../models/').User;
const Post = require('../models/').Post;
const LikePost = require('../models/').LikePost;
const sequelize = require('../models/').sequelize;
const { QueryTypes } = require('sequelize');
const _ = require('lodash');
//create

exports.create = async (req, res, next) => {
  try {
    const post = await Post.create({ ...req.body, userId: req.user.id });
    //     await post.save();
    res.status(201).json(post);
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

  const isValidUpdate = updates.every((update) =>
    allowsUpdate.includes(update)
  );
  try {
    if (!isValidUpdate) {
      throw new api400Error('Thay đổi không hợp lệ"');
    }
    let id = req.params.id;
    const post = await Post.findByPk(id);

    if (post.userId === req.user.id) {
      updates.forEach((update) => (post[update] = req.body[update]));

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

    if (post.userId === req.user.id || req.user.isAdmin === true) {
      await post.deleteOne();
      res.status(204).json();
    } else {
      res.status(403).json('you can delete your post');
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
    // if (!post) throw new api404Error("Không thấy bài viết nào");
    res.status(200).json({ data: { post } });
  } catch (error) {
    next(error);
  }
};
// like a post
exports.like = async (req, res, next) => {
  try {
    const postId = req.params.id;
    let UserId = req.user.id;
    let post = await Post.findByPk(postId);
    if (!post) throw new api404Error('Không thấy bài viết');
    let likedPost = await LikePost.findAll({
      where: {
        postId,
        UserId,
      },
    });
    if (likedPost.length === 0) {
      await LikePost.create({ postId, UserId });
      res.status(200).json({ message: 'bạn đã thích thành công' });
    } else {
      await LikePost.destroy({ where: { postId, UserId } });
      res.status(200).json({ message: 'bạn đã bỏ thích thành công' });
    }
  } catch (error) {
    next(error);
  }
};
// get posts timeline
exports.getTimeLine = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const userPost = await Post.findAll({ where: { userId }, raw: true });
    // console.log(userPost);
    const friends = await sequelize.query(
      `select followedId, fullName, profilePicture from Followers fw
      join Users  u on fw.followedId = u.id WHERE fw.followingId = ${userId}`,
      {
        type: QueryTypes.SELECT,
      }
    );
    console.log(friends);
    const friendPosts = await Promise.all(
      friends.map(async (friend) => {
        return Post.findAll({
          where: { userId: friend.followedId },
          raw: true,
        });
      })
    );

    console.log(friendPosts);
    data = userPost.concat(...friendPosts);
    _.forEach(data, (item) => {
      const friend = _.find(friends, { followedId: item.userId });
      if (friend) {
        // _.set(item, 'profilePicture', friend.profilePicture);
        // _.set(item, 'fullName', friend.fullName);
        item.profilePicture = _.get(friend, 'profilePicture', '');
        item.fullName = _.get(friend, 'fullName', '');
      } else {
        item.profilePicture = _.get(req.user, 'profilePicture', '');
        item.fullName = _.get(req.user, 'fullName', '');
      }
      console.log(item);
    });
    data.sort((p1, p2) => {
      return new Date(p2.createdAt) - new Date(p1.createdAt);
    });

    res.status(200).json({ data });
  } catch (error) {
    next(error);
  }
};
//get posts on profile
exports.getProfilePost = async (req, res, next) => {
  try {
    const username = req.params.username;
    const user = await User.findOne({ where: { username } });
    const userPost = await Post.findAll({
      where: { userId: user.id },
      raw: true,
    });
    _.forEach(userPost, (item) => {
      item.profilePicture = user.profilePicture;
      item.fullName = user.fullName;
    });

    res.status(200).json({ data: userPost });
  } catch (error) {
    next(error);
  }
};
// exports.getProfilePost = async (req, res, next) => {
//   try {
//     const username = req.params.username;
//     const user = await User.findOne({ where: { username } });
//     const userPost = await Post.findAll({ where: { userId: user.id } });

//     res.status(200).json({ data: userPost });
//   } catch (error) {
//     next(error);
//   }
// };
// exports.getProfilePost = async (req, res, next) => {
//   try {
//     const username = req.params.username;
//     const user = await User.findOne({ where: { username } });
//     const userPost = await Post.findAll({ where: { userId: user.id } });

//     res.status(200).json({ data: userPost });
//   } catch (error) {
//     next(error);
//   }
// };
