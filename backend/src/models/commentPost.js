"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class CommentPost extends Model {
    static associate(models) {
      //   CommentPost.belongsTo(models.Classroom, {
      //     foreignKey: "classroom_id",
      //     as: "classroom",
      //   });
      //   CommentPost.belongsToMany(models.Course, {
      //     through: "CommentPostCourse",
      //     as: "courses",
      //     foreignKey: "CommentPost_id",
      //   });
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
      modelName: "CommentPost",
    }
  );
  return CommentPost;
};
