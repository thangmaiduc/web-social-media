"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Otp extends Model {
    static associate(models) {
      //   Otp.belongsTo(models.Classroom, {
      //     foreignKey: "classroom_id",
      //     as: "classroom",
      //   });
      //   Otp.belongsToMany(models.Course, {
      //     through: "OtpCourse",
      //     as: "courses",
      //     foreignKey: "Otp_id",
      //   });
    }
  }
  Otp.init(
    {
      userId: {
        type: DataTypes.INTEGER,
        require: true,
        allowNull: false,
      },

      otp: {
        type: DataTypes.STRING,
        allowNull: false,
      },

      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
    },
    {
      sequelize,
      modelName: "Otp",
      timestamps: true,
    }
  );
  return Otp;
};
