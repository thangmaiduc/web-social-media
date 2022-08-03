'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Message extends Model {
    static associate(models) {
      Message.belongsTo(models.Conversation, {
        foreignKey: 'conversationId',
      });
      Message.belongsTo(models.User, {
        foreignKey: 'senderId',
      });
      Message.hasMany(models.Attachment, {
        foreignKey: 'messageId',
      });
    }
  }
  Message.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      conversationId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      senderId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      text: {
        type: DataTypes.TEXT,
      },
    },
    {
      sequelize,
      modelName: 'Message',
      timestamps: true,
    }
  );
  return Message;
};
