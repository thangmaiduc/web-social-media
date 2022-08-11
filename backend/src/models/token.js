"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Token extends Model {
    static associate(models) {
        // Token.belongsTo(models.User, {
        //   foreignKey: "classroom_id",
        //   as: "classroom",
        // });
      //   Token.belongsToMany(models.Course, {
      //     through: "TokenCourse",
      //     as: "courses",
      //     foreignKey: "Token_id",
      //   });
    }
  }
  Token.init(
    {
      userId: {
        type: DataTypes.INTEGER,
        require: true,
        allowNull: false,
      },

      token: {
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
      modelName: "Token",
      timestamps: true,
    }
  );
  return Token;
};
