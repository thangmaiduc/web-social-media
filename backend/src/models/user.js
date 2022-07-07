"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    
    static associate(models) {
      User.hasMany(models.Post, {
        foreignKey: "userId",
        as: "posts",
      });
      User.hasOne(models.Participant, {
        foreignKey: "userId",
      });
      User.hasMany(models.Message, {
        foreignKey: "senderId",
      });
      User.hasMany(models.Conversation, {
        foreignKey: "creatorId",
      });
      User.belongsToMany(models.User, {
        as: "Following",
        through: models.Follower,
        foreignKey: "followingId",
        onDelete: "CASCADE",
      });

      User.belongsToMany(models.User, {
        as: "Followed",
        through: models.Follower,
        foreignKey: "followedId",
        onDelete: "CASCADE",
      });

      User.belongsToMany(models.Post, {
        through: models.CommentPost,
        foreignKey: "userId",
        otherKey: "postId",
        onDelete: "CASCADE",
      });
      User.belongsToMany(models.Post, {
        // foreignKey: "userId",
        through: models.LikePost,
        otherKey: "postId",
        onDelete: "CASCADE",
      });
    }
  }
  User.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      username: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
      },
      fullName: {
        type: DataTypes.STRING,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      profilePicture: {
        type: DataTypes.STRING,
        defaultValue: "",
      },
      coverPicture: {
        type: DataTypes.STRING,
        defaultValue: "",
      },

      isAdmin: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      desc: {
        type: DataTypes.STRING,
        max: 50,
      },
      city: {
        type: DataTypes.STRING,
        max: 50,
      },
      country: {
        type: DataTypes.STRING,
        max: 50,
      },
    },
    {
      sequelize,
      modelName: "User",
      timestamps: true,
    }
  );
  return User;
};
