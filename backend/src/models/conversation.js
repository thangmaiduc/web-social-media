'use strict';
const { Model } = require('sequelize');
// const { gzipSync, gunzipSync } = require('zlib');
const Participant = require('./index').Participant;

module.exports = (sequelize, DataTypes) => {
  class Conversation extends Model {
    static associate(models) {
      Conversation.belongsTo(models.User, {
        foreignKey: 'creatorId',
        as: 'creator',
      });
      Conversation.belongsToMany(models.User, {
        // as: 'participants',
        foreignKey: 'conversationId',
        through: models.Participant,
        onDelete: 'CASCADE',
      });
      Conversation.hasMany(models.Participant, {
        as: 'participants',
        foreignKey: 'conversationId',
      });
      Conversation.hasMany(models.Message, {
        foreignKey: 'conversationId',
        as: 'messages',
      });
    }
  }
  Conversation.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      title: {
        type: DataTypes.STRING(40),
        defaultValue: '',
        // get() {
        //   const storedValue = this.getDataValue('content');
        //   const gzippedBuffer = Buffer.from(storedValue, 'base64');
        //   const unzippedBuffer = gunzipSync(gzippedBuffer);
        //   return unzippedBuffer.toString();
        // },
        // set(value) {
        //   const gzippedBuffer = gzipSync(value);
        //   this.setDataValue('content', gzippedBuffer.toString('base64'));
        // },
      },
      // displayName: {
      //   type: DataTypes.VIRTUAL,
      //   async get() {},
      //   set(value) {
      //     this.setDataValue('displayName', value);
      //   },
      // },
      img: {
        type: DataTypes.STRING,
        defaultValue: null,
      },
      creatorId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      type: {
        type: DataTypes.ENUM('public', 'private'),
      },
    },
    {
      sequelize,
      modelName: 'Conversation',
      timestamps: true,
    }
  );
  return Conversation;
};
