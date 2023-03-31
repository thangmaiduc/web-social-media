'use strict';
const { Model } = require('sequelize');
const es = require('../../config/es');
const saveDocument = (instance) => {
  return es.create({
    index: 'groups',
    type: 'groups',
    id: instance.dataValues.id,
    body: {
      title: instance.dataValues.title,
    },
  });
};
const updateDocument = (instance) => {
  if (instance.dataValues.title)
    return es.update({
      index: 'groups',
      type: 'groups',
      id: instance.dataValues.id,
      body: {
        doc: { title: instance.dataValues.title },
      },
    });
};
const deleteDocument = (instance) => {
  return es.delete({
    index: 'groups',
    type: 'groups',
    id: instance.dataValues.id,
  });
};
module.exports = (sequelize, DataTypes) => {
  class Group extends Model {
    static associate(models) {
      Group.belongsTo(models.User, {
        foreignKey: 'creatorId',
      });
      Group.belongsToMany(models.User, {
        as: 'members',
        foreignKey: 'groupId',
        through: models.GroupMember,
        onDelete: 'CASCADE',
      });
      Group.hasMany(models.GroupMember, {
        foreignKey: 'groupId',
      });
      Group.hasMany(models.Post, {
        foreignKey: 'groupId',
        as: 'posts',
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
      img: {
        type: DataTypes.STRING,
        defaultValue:
          'https://www.facebook.com/images/groups/groups-default-cover-photo-2x.png',
      },
      creatorId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      type: {
        type: DataTypes.ENUM('APPROVED', 'FREE'),
        defaultValue: 'FREE',
      },
      state: {
        type: DataTypes.ENUM('ACTIVATED', 'INACTIVATED'),
        defaultValue: 'ACTIVATED',
      },
    },
    {
      sequelize,
      modelName: 'Group',
      timestamps: true,
      hooks: {
        afterCreate: saveDocument,
        afterUpdate: updateDocument,
        afterDestroy: deleteDocument,
      },
    }
  );
  return Group;
};
