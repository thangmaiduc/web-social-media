'use strict';
const { Model } = require('sequelize');
const GeneralConstants = require('../GeneralConstants');
module.exports = (sequelize, DataTypes) => {
  class ReceiverNotification extends Model {
    static associate(models) {
      ReceiverNotification.belongsTo(models.User, {
        foreignKey: 'receiverId',
        as: 'user',
      });
      // ReceiverNotification.belongsTo(models.Notification, {
      //   foreignKey: 'notificationId',
      //   as: 'notification',
      // });
    }
  }
  ReceiverNotification.init(
    {
      subjectId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
      },
      type: {
        type: DataTypes.STRING(20),
        allowNull: false,
        primaryKey: true,
      },
      receiverId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
      },
      state: {
        type: DataTypes.ENUM(Object.values(GeneralConstants.STATE_NOTIFY)),
        defaultValue: 'ACTIVATED',
      },
    },
    {
      sequelize,
      // freezeTableName: true,
      modelName: 'ReceiverNotification',
    }
  );
  return ReceiverNotification;
};
