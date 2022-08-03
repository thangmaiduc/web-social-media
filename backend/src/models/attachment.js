'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Attachment extends Model {
    static associate(models) {
      Attachment.belongsTo(models.Message, {
        foreignKey: 'messageId',
      });
    }
  }
  Attachment.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      messageId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      thumbUrl: {
        type: DataTypes.STRING,
      },
      fileUrl: {
        type: DataTypes.STRING,
      },
    },
    {
      sequelize,
      modelName: 'Attachment',
      timestamps: true,
    }
  );
  return Attachment;
};
