"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Participant extends Model {
    static associate(models) {
      Participant.belongsTo(models.Conversation, {
        foreignKey: "conversationId",
        // as: "classroom",
      });
      Participant.belongsTo(models.User, {
        foreignKey: "userId",
      });
    }
  }
  Participant.init(
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
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "Participant",
      timestamps: true,
    }
  );
  return Participant;
};
