"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class LikedPost extends Model {
    static associate(models) {
      //   LikedPost.belongsTo(models.Classroom, {
      //     foreignKey: "classroom_id",
      //     as: "classroom",
      //   });
      //   LikedPost.belongsToMany(models.Course, {
      //     through: "LikedPostCourse",
      //     as: "courses",
      //     foreignKey: "LikedPost_id",
      //   });
    }
  }
  LikedPost.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      postId: {
        type: DataTypes.INTEGER,
      },
      userId: {
        type: DataTypes.INTEGER,
      },
    },
    {
      sequelize,
      modelName: "LikedPost",
    }
  );
  return LikedPost;
};
