'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Conversation extends Model {
    static associate(models) {
      Conversation.belongsTo(models.User, {
        foreignKey: 'creatorId',
      });
      Conversation.hasMany(models.Participant, {
        foreignKey: 'conversationId',
      });
      Conversation.hasMany(models.Message, {
        foreignKey: 'conversationId',
      });
    }
  }
  Conversation.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      title: {
        type: DataTypes.STRING(40),
        defaultValue: '',
      },
      creatorId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'Conversation',
      timestamps: true,
    }
  );
  return Conversation;
};
