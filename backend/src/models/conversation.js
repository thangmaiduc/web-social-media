'use strict';
const { Model, Op } = require('sequelize');
const _ = require('lodash');
const GeneralConstants = require('../GeneralConstants');
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
    async getImg(userId = null) {
      const img = [];
      if (_.isEmpty(this.img)) {
        let that = await Conversation.findByPk(this.id, {
          include: [
            {
              association: 'participants',
              include: [
                {
                  association: 'user',
                  attributes: ['profilePicture'],
                },
              ],
              where: {
                userId: {
                  [Op.ne]: userId,
                },
              },
            },
          ],
        });
        that.participants.map(
          (participant, idx) =>
            idx < 2 && img.push(participant.user.profilePicture)
        );
      } else {
        img.push(this.img);
      }
      return img;
    }

    async getDisplayName(userId) {
      if (!_.isEmpty(this.title)) return this.title;
      let that = await Conversation.findByPk(this.id, {
        include: [
          {
            association: 'participants',
            include: [
              {
                association: 'user',
                attributes: ['fullName'],
              },
            ],
          },
        ],
      });
      const participants = that.participants;
      let title = '';
      if (this.type === GeneralConstants.TYPE_CONVERSATION.PRIVATE) {
        title = participants.find((item) => item.userId !== userId).user
          .fullName;
      } else {
        participants.forEach((item) => {
          title += item.user.fullName + ', ';
        });
        title = title.substring(0, title.length - 2);
      }
      return title;
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
      },

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
