'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class LikePost extends Model {
    static associate(models) {
      // LikePost.há(models.Post, {
      //   foreignKey: "postId",
      //   as: "post",
      // });
    }
  }
  LikePost.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      postId: {
        type: DataTypes.INTEGER,
      },
    },
    {
      sequelize,
      modelName: 'LikePost',
    }
  );
  return LikePost;
};
