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
      Post.hasMany(models.CommentPost, {
        foreignKey: "postId",
        onDelete: "CASCADE",
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
    },
    {
      sequelize,
      modelName: "Post",
      timestamps: true,
    }
  );
  return Post;
};
