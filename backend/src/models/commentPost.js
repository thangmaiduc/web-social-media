'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class CommentPost extends Model {
    static associate(models) {
      CommentPost.belongsTo(models.User, {
        foreignKey: "userId",
        as: "user",
      });
      CommentPost.belongsTo(models.Post, {
        foreignKey: "postId",
        as: "post",
      });
    }
  }
  CommentPost.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      postId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      text: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'CommentPost',
    }
  );
  return CommentPost;
};
