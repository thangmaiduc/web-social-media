const User = require('../models/').User;
const Follower = require('../models/').Follower;
const sequelize = require('../models/').sequelize;
const { QueryTypes } = require('sequelize');
const api400Error = require('../utils/errors/api400Error');
const api404Error = require('../utils/errors/api404Error');

// * update

exports.update = async (req, res, next) => {
  try {
    res.json(req.user);
  } catch (error) {
    next(error);
  }
};
// * delete a user
exports.delete = async (req, res, next) => {
  try {
    res.json({ data: req.user });
  } catch (error) {
    next(error);
  }
};
// * get a user
exports.get = async (req, res, next) => {
  try {
    let username = req.params.username;
    let user = await User.findOne({
      where: { username },
    });
    if (!user) throw new api404Error('Không thấy user');
    const {id, profilePicture, coverPicture, fullName, city, country } = user;
    res.json({
      data: {id, profilePicture, coverPicture, fullName, city, country },
    });
  } catch (error) {
    next(error);
  }
};

// * get by id
exports.getById = async (req, res, next) => {
  try {
    let id = req.params.id;
    let user = await User.findByPk(id);
    if (!user) throw new api404Error('Không thấy user');
    const { profilePicture, coverPicture, fullName, city, country } = user;
    res.json({
      data: { profilePicture, coverPicture, fullName, city, country },
    });
  } catch (error) {
    next(error);
  }
};
//get me
exports.getMe = async (req, res, next) => {
  try {
    res.json(req.user);
  } catch (error) {
    next(error);
  }
};
// * get users
exports.getAll = async (req, res, next) => {
try {
    let user = await User.findAll({ attributes: ['id', 'username', 'email'] });
    res.json({ data: user });
  } catch (error) {
    next(error);
  }
};

// * get all user's friends
exports.getFriends = async (req, res, next) => {
  try {
    let username = req.params.username;
    let user = await User.findOne({
      where: { username },
    });
    let followingId = user.id;
    const users = await sequelize.query(
      `select followedId, username, profilePicture, coverPicture,  fullName from Followers fw
      join Users  u on fw.followedId = u.id WHERE fw.followingId = ${followingId}`,
      {
        type: QueryTypes.SELECT,
      }
    );

    res.json({ data: users });
  } catch (error) {
    next(error);
  }
};
// * follow a user
exports.follow = async (req, res, next) => {
  try {
    let followedId = req.params.id;
    let followingId = req.user.id;
    let userCheck = await User.findOne({
      where: { id: followedId },
    });

    if (!userCheck) {
      throw new api400Error('Người này không tồn tại');
    }
    if (followedId == followingId) {
      throw new api400Error('Bạn không thể theo dõi chính mình');
    }
    let followerCheck = await Follower.findOne({
      where: { followedId, followingId },
    });
    if (followerCheck) {
      throw new api400Error('Bạn đã theo dõi người này rồi');
    }
    follower = await Follower.create({ followedId, followingId });

    res.json({ message: 'Bạn đã theo dõi thành công' });
  } catch (error) {
    next(error);
  }
};
// * unfollow a user
exports.unfollow = async (req, res, next) => {
  try {
    let unfollowingId = req.params.id;
    let followingId = req.user.id;
    let userCheck = await User.findOne({
      where: { id: unfollowingId },
    });

    if (!userCheck) {
      throw new api400Error('Người này không tồn tại');
    }
    if (unfollowingId == followingId) {
      throw new api400Error('Bạn không thể bỏ theo dõi chính mình');
    }
    let followerCheck = await Follower.findOne({
      where: { followedId: unfollowingId, followingId },
    });
    if (!followerCheck) {
      throw new api400Error('Bạn chưa theo dõi người này');
    }
    await Follower.destroy({
      where: { followedId: unfollowingId, followingId },
    });

    res.json({ message: 'Bạn đã bỏ theo dõi thành công' });
  } catch (error) {
    next(error);
  }
};

// router.get("/",);
// //get all user's friends
// router.get("/friends/:userId", async (req, res) => {

//   try {
//     let userId= req.params.userId
//     let user = await User.findById(userId);
//     userFriends =await Promise.all( user.followings.map(async friendId =>await User.findById(friendId, {profilePicture:1, username:1, _id:1}) ))
//     res.status(200).json(userFriends)
//   } catch (error) {

//     res.status(500).json(error.message);
//     console.log(error.message);
//   }
// });

// //follow a user
// router.put('/:id/follow',async (req, res) =>{
//     try {
//         if(req.body.userId !== req.params.id){
//             const user = await User.findById(req.params.id);
//             const currentUser = await User.findById(req.body.userId);
//             if(!currentUser.followings.includes(user.id)){
//                 await user.updateOne({$push:{ followers: currentUser._id} })
//                 await currentUser.updateOne({$push:{ followings: user._id} })
//                 res.status(200).json('you have followed successfully');
//             }else{
//                 res.status(400).json('you already have followed');
//             }
//         }
//         else {
//             res.status(400).json('you only can follow others');
//         }

//     } catch (error) {

//         res.status(500).json(error.message);
//         console.log(error.message);
//     }
// })
// //unfollow a user

// router.put('/:id/unfollow',async (req, res) =>{
//     try {
//         if(req.body.userId !== req.params.id){
//             const user = await User.findById(req.params.id);
//             const currentUser = await User.findById(req.body.userId);
//             if(currentUser.followings.includes(user.id)){
//                 await user.updateOne({$pull:{ followers: currentUser._id} })
//                 await currentUser.updateOne({$pull:{ followings: user._id} })
//                 res.status(200).json('you have unfollowed successfully');
//             }else{
//                 res.status(400).json('you havenot followed yet');
//             }
//         }
//         else {
//             res.status(400).json('you only can unfollow others');
//         }

//     } catch (error) {

//         res.status(500).json(error.message);
//         console.log(error.message);
//     }
// })
