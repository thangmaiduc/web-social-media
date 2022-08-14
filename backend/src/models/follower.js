'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Follower extends Model {
    static associate(models) {}
  }
  Follower.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      // id người đang theo dõi
      followingId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      // id người đang được theo dõi
      followedId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'Follower',
      timestamps: true,
    }
  );
  return Follower;
};
