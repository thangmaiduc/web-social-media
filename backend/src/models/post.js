'use strict';
const es = require('../../config/es');
const { Model } = require('sequelize');
const redis = require('../utils/redis');

const saveDocument = (instance) => {
  redis.set(`USER_ID:${instance.id}`, instance);
  return es.create({
    index: 'posts',
    type: 'posts',
    id: instance.dataValues.id,
    body: {
      description: instance.dataValues.description,
    },
  });
};
const updateDocument = (instance) => {
  redis.set(`USER_ID:${instance.id}`, instance);
  return es.update({
    index: 'posts',
    type: 'posts',
    id: instance.dataValues.id,
    body: {
      description: instance.dataValues.description,
    },
  });
};
const deleteDocument = (instance) => {
  redis.del(`USER_ID:${instance.id}`, instance);
  return es.delete({
    index: 'posts',
    type: 'posts',
    id: instance.dataValues.id,
  });
};
module.exports = (sequelize, DataTypes) => {
  class Post extends Model {
    static associate(models) {
      Post.belongsTo(models.User, {
        foreignKey: 'userId',
        as: 'user',
      });
      Post.belongsTo(models.Group, {
        foreignKey: 'groupId',
        as: 'group',
      });
      Post.belongsToMany(models.User, {
        through: models.LikePost,
        foreignKey: 'postId',
        onDelete: 'CASCADE',
      });
      Post.belongsToMany(models.User, {
        through: models.ReportPost,
        foreignKey: 'postId',
        onDelete: 'CASCADE',
      });
      Post.hasMany(models.CommentPost, {
        foreignKey: 'postId',
        onDelete: 'CASCADE',
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
      groupId: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },

      img: {
        type: DataTypes.STRING,
        defaultValue: '',
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
      modelName: 'Post',
      timestamps: true,
      hooks: {
        afterCreate: saveDocument,
        afterUpdate: updateDocument,
        afterDestroy: deleteDocument,
      },
    }
  );
  return Post;
};
