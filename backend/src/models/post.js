"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Post extends Model {
    static associate(models) {
      Post.belongsTo(models.User, {
        foreignKey: "userId",
        as: "user",
      });
      Post.belongsToMany(models.User, {
        through: models.LikePost,
        foreignKey: "postId",
        onDelete: "CASCADE",
      });
      Post.belongsToMany(models.User, {
      
        through: models.ReportPost,
        foreignKey: "postId",
        onDelete: "CASCADE",
      });
      Post.hasMany(models.CommentPost, {
        foreignKey: "postId",
        onDelete: "CASCADE",
      });
      // * super Many - Many
      Post.hasMany(models.ReportPost, {
        foreignKey: 'postId',
      });
      Post.hasMany(models.LikePost, {
        foreignKey: 'postId',
      });
    }
  }
  Post.init(
    {
      userId: {
        type: DataTypes.INTEGER,
        require: true,
        allowNull: false,
      },

      img: {
        type: DataTypes.STRING,
        defaultValue: "",
      },

      description: {
        type: DataTypes.STRING,
        max: 500,
      },
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      isBlock: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
    },
    {
      sequelize,
      modelName: "Post",
      timestamps: true,
    }
  );
  return Post;
};
