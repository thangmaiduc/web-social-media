'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class GroupMember extends Model {
    static associate(models) {
      // GroupMember.belongsTo(models.Conversation, {
      //   foreignKey: 'conversationId',
      // });
      // GroupMember.belongsTo(models.User, {
      //   foreignKey: 'userId',
      // });
      GroupMember.belongsTo(models.Group, {
        foreignKey: 'groupId',
      });
      GroupMember.belongsTo(models.User, {
        foreignKey: 'userId',
      });
    }
  }
  GroupMember.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      groupId: {
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
      state: {
        type: DataTypes.ENUM('PENDING', 'APPROVED', 'REJECTED', 'BANNED'),
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
      modelName: 'GroupMember',
      timestamps: true,
    }
  );
  return GroupMember;
};
