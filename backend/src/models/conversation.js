"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Conversation extends Model {
    static associate(models) {
      Conversation.belongsTo(models.User, {
        foreignKey: "creatorId",
        // as: "classroom",
      });
      Conversation.hasMany(models.Participant, {
        // as: "courses",
        foreignKey: "conversationId",
      });
      Conversation.hasMany(models.Message, {
        // as: "courses",
        foreignKey: "conversationId",
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
      tittle: {
        type: DataTypes.STRING(40),
        defaultValue: "",
      },
      creatorId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "Conversation",
      timestamps: true,
    }
  );
  return Conversation;
};
