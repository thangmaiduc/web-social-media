'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Participant extends Model {
    static associate(models) {
      // Participant.belongsTo(models.Conversation, {
      //   foreignKey: 'conversationId',
      // });
      // Participant.belongsTo(models.User, {
      //   foreignKey: 'userId',
      // });
      Participant.belongsTo(models.Conversation, {
        foreignKey: 'conversationId',
        as: 'conversation',
      });
      Participant.belongsTo(models.User, {
        foreignKey: 'userId',
        as: 'user',
      });
    }
  }
  Participant.init(
    {
      // id: {
      //   type: DataTypes.INTEGER,
      //   autoIncrement: true,
      //   primaryKey: true,
      // },
      conversationId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      isAdmin: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      isView: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      isClick: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
    },
    {
      // indexes: [
      //   {
      //     unique: true,
      //     fields: ["userId", "conversationId", "type"],
      //   },
      // ],
      sequelize,
      modelName: 'Participant',
      timestamps: true,
    }
  );
  return Participant;
};
