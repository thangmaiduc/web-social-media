'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ReportPost extends Model {
    static associate(models) {
      ReportPost.belongsTo(models.User, {
        foreignKey: 'userId',
      });
      ReportPost.belongsTo(models.Post, {
        foreignKey: 'postId',
      });
    }
  }
  ReportPost.init(
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
      modelName: 'ReportPost',
    }
  );
  return ReportPost;
};
