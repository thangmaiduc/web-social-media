//add member
exports.addParticipant = async (req, res, next) => {
  try {
    const username = req.params.username;
    const user = await User.findOne({ where: { username } });
    const userPost = await Post.findAll({ where: { userId: user.id } });

    res.status(200).json({ message: userPost });
  } catch (error) {
    next(error);
  }
};
//new group chat

exports.create = async (req, res, next) => {
  try {
    const username = req.params.username;
    const user = await User.findOne({ where: { username } });
    const userPost = await Post.findAll({ where: { userId: user.id } });

    res.status(200).json({ message: userPost });
  } catch (error) {
    next(error);
  }
};

//get conv of a user
exports.get = async (req, res, next) => {
  try {
    const username = req.params.username;
    const user = await User.findOne({ where: { username } });
    const userPost = await Post.findAll({ where: { userId: user.id } });

    res.status(200).json({ message: userPost });
  } catch (error) {
    next(error);
  }
};
