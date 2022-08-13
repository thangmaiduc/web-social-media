'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ReportUser extends Model {
    static associate(models) {}
  }
  ReportUser.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      reportedId: {
        type: DataTypes.INTEGER,
      },
      reportingId: {
        type: DataTypes.INTEGER,
      },
    },
    {
      sequelize,
      modelName: 'ReportUser',
    }
  );
  return ReportUser;
};
