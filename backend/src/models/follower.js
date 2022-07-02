"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Follower extends Model {
    static associate(models) {
      //   Follower.belongsTo(models.Classroom, {
      //     foreignKey: "classroom_id",
      //     as: "classroom",
      //   });
      //   Follower.belongsToMany(models.Course, {
      //     through: "FollowerCourse",
      //     as: "courses",
      //     foreignKey: "Follower_id",
      //   });
    }
  }
  Follower.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      followingId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      followedId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "Follower",
      timestamps: true,
    }
  );
  return Follower;
};
