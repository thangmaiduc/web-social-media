'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Group extends Model {
    static associate(models) {
      Group.belongsTo(models.User, {
        foreignKey: 'creatorId',
      });
      Group.belongsToMany(models.User, {
        as: 'members',
        foreignKey: 'groupId',
        through: models.GroupMembers,
        onDelete: 'CASCADE',
      });
      Group.hasMany(models.Post, {
        foreignKey: 'groupId',
      });
    }
  }
  Group.init(
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
      type: {
        type: DataTypes.ENUM('APPROVED', 'FREE'),
      },
      state: {
        type: DataTypes.ENUM('ACTIVATED', 'INACTIVATED'),
      },
    },
    {
      sequelize,
      modelName: 'Group',
      timestamps: true,
    }
  );
  return Group;
};
