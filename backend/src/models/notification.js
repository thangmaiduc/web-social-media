'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Notification extends Model {
    static associate(models) {
      Notification.belongsTo(models.User, {
        foreignKey: 'userId',
        as: 'user',
      });
      // Notification.belongsTo(models.User, {
      //   foreignKey: 'receiverId',
      //   as: 'receiver',
      // });
      // Notification.belongsTo(models.Post, {
      //   foreignKey: 'subjectId',
      //   as: 'post',
      // });
      // Notification.belongsTo(models.Group, {
      //   foreignKey: 'subjectId',
      //   as: 'group',
      // });
      // Notification.hasMany(models.ReceiverNotification, {
      //   foreignKey: 'notificationId',
      //   as: 'notifications',
      // });
    }
  }
  Notification.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      // postId: {
      //   type: DataTypes.INTEGER,
      //   allowNull: true,
      // },
      subjectId: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      type: {
        type: DataTypes.STRING(20),
        allowNull: false,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      text: {
        type: DataTypes.STRING(40),
        allowNull: true,
      },
      // receiverId: {
      //   type: DataTypes.INTEGER,
      //   allowNull: false,
      // },

      isView: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      isClicked: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
    },
    {
      sequelize,
      modelName: 'Notification',
    }
  );
  return Notification;
};
