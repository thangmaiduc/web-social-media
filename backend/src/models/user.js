'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      User.hasMany(models.Post, {
        foreignKey: 'userId',
        as: 'posts',
      });
      User.hasMany(models.Message, {
        foreignKey: 'senderId',
      });
      User.hasMany(models.Message, {
        foreignKey: 'senderId',
      });
      User.belongsToMany(models.Conversation, {
        foreignKey: 'userId',
        through: models.Participant,
        onDelete: 'CASCADE',
      });
      User.belongsToMany(models.User, {
        as: 'FollowingMM',
        through: models.Follower,
        foreignKey: 'followingId',
        onDelete: 'CASCADE',
      });
      User.belongsToMany(models.User, {
        as: 'FollowedMM',
        through: models.Follower,
        foreignKey: 'followedId',
        onDelete: 'CASCADE',
      });
      User.belongsToMany(models.User, {
        as: 'ReportedMM',
        through: models.ReportUser,
        foreignKey: 'reportedId',
        onDelete: 'CASCADE',
      });
      User.belongsToMany(models.User, {
        as: 'ReportingMM',
        through: models.ReportUser,
        foreignKey: 'reportingId',
        onDelete: 'CASCADE',
      });
      User.hasMany(models.CommentPost, {
        foreignKey: 'userId',
        onDelete: 'CASCADE',
      });
      User.belongsToMany(models.Post, {
        through: models.LikePost,
        otherKey: 'postId',
        onDelete: 'CASCADE',
      });
      User.belongsToMany(models.Post, {
        through: models.ReportPost,
        foreignKey: 'userId',
        onDelete: 'CASCADE',
      });
      // * super Many -Many
      User.hasMany(models.LikePost, {
        foreignKey: 'userId',
      });
      User.hasMany(models.Follower, {
        as: 'Followed',
        foreignKey: 'followedId',
      });
      User.hasMany(models.Follower, {
        as: 'Following',
        foreignKey: 'followingId',
      });
      User.hasMany(models.ReportUser, {
        as: 'Reported',
        foreignKey: 'reportedId',
      });
      User.hasMany(models.ReportUser, {
        as: 'Reporting',
        foreignKey: 'reportingId',
      });
      User.hasMany(models.ReportPost, {
        foreignKey: 'userId',
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
        defaultValue: '',
      },
      coverPicture: {
        type: DataTypes.STRING,
        defaultValue: '',
      },

      isAdmin: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      isBlock: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      description: {
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
      modelName: 'User',
      timestamps: true,
    }
  );
  return User;
};
