const moment = require('moment');
const User = require('../models').User;

const Message = require('../models').Message;
const _ = require('lodash');
const GroupMember = require('../models').GroupMember;
const Group = require('../models').Group;
const sequelize = require('../models').sequelize;
const { QueryTypes, Op } = require('sequelize');
const Api404Error = require('../utils/errors/api404Error');
const api400Error = require('../utils/errors/api400Error');
const GeneralConstants = require('../GeneralConstants');
const client = require('../../config/es');

const noAvatar =
  'https://res.cloudinary.com/dzens2tsj/image/upload/v1661242291/chat-icon-people-group-260nw-437341633_vlkiwo.webp';
//add member
exports.addMembers = async (req, res, next) => {
  try {
    console.log(req.params, req.body);
    let groupId = req.params.id;
    let userId = req.user.id;
    let userIdsBody = _.get(req, 'body.users', []);
    userIdsBody = userIdsBody.filter((val) => val !== userId);
    if (userIdsBody.length == 0)
      throw new api400Error('Không có người dùng nào');
    const group = await Group.findOne({
      where: { id: groupId, state: GeneralConstants.STATE_GROUP.ACTIVATED },
    });
    if (!group) {
      throw new Api404Error('Không tìm thấy nhóm');
    }
    const checkRole = await GroupMember.findOne({
      where: {
        userId,
        groupId: group.id,
        state: GeneralConstants.STATE_MEMBER.APPROVED,
      },
    });
    if (!checkRole) throw new Api404Error('Chưa gia nhập nhóm');
    // * check lọc ra các thành viên chưa gia nhập
    const userJoined = await GroupMember.findAll({ where: { groupId } });
    const userJoinedUserIds = userJoined.map((gm) => gm.userId);
    const userNotJoined = _.difference(userIdsBody, userJoinedUserIds);
    // * check các userIds có phải là người dùng k bị chặn hay k
    const users = await User.findAll({
      where: {
        id: { [Op.in]: userNotJoined },
        isBlock: false,
      },
      attributes: ['id'],
    });
    // * tạo ra mảng các thành viên chuẩn bị gia nhập, neu la admin moi auto duyet thanh cong
    const members = users.map((user) => {
      let member = {
        userId: user.id,
        groupId: group.id,
        isAdmin: false,
        state: GeneralConstants.STATE_MEMBER.PENDING,
      };
      if (checkRole.isAdmin)
        member.state = GeneralConstants.STATE_MEMBER.APPROVED;
      return member;
    });
    await GroupMember.bulkCreate(members);

    res.status(200).json({ message: 'Thêm thành viên thành công' });
  } catch (error) {
    next(error);
  }
};
exports.updateGroup = async (req, res, next) => {
  try {
    console.log(req.params, req.body);
    let groupId = req.params.id;
    let userId = req.user.id;
    const { title = null, type } = req.body;

    const group = await Group.findOne({
      where: { id: groupId },
    });
    if (!group) throw new Api404Error('Không tìm thấy nhóm');
    const checkRole = await GroupMember.findOne({
      where: { userId, groupId: group.id },
    });
    if (!checkRole) throw new Api404Error('Không tìm thấy nhóm');
    if (!checkRole.isAdmin)
      throw new api400Error('Không có quyền sửa tên nhóm');

    if (title) group.title = title;
    if (type) group.type = type;
    const groupEdited = await group.save();
    res.status(200).json({ message: 'Sửa nhóm thành công', data: groupEdited });
  } catch (error) {
    next(error);
  }
};
exports.approve = async (req, res, next) => {
  try {
    console.log(req.params, req.body);
    let userId = req.user.id;
    const { groupId, userJoinIds } = req.body;

    const group = await Group.findOne({
      where: { id: groupId, state: GeneralConstants.STATE_GROUP.ACTIVATED },
    });
    if (!group) throw new Api404Error('Không tìm thấy nhóm');
    const checkRole = await GroupMember.findOne({
      where: { userId, groupId: group.id },
    });
    if (!checkRole) throw new Api404Error('Không tìm thấy nhóm');
    if (!checkRole.isAdmin)
      throw new api400Error('Không có quyền duyệt thành viên');

    const unapprovedMembers = await GroupMember.findAll({
      where: {
        id: {
          [Op.in]: userJoinIds,
        },
        groupId: group.id,
        isAdmin: false,
        state: {
          [Op.ne]: GeneralConstants.STATE_MEMBER.APPROVED,
        },
      },
    });
    if (unapprovedMembers.length <= 0)
      throw new Api404Error('Không tìm thấy thành viên');
    const unapprovedMemberIds = unapprovedMembers.map(
      (unapprovedMember) => unapprovedMember.id
    );
    await GroupMember.update(
      { state: GeneralConstants.STATE_MEMBER.APPROVED },
      {
        where: {
          id: {
            [Op.in]: unapprovedMemberIds,
          },
        },
      }
    );

    res.status(200).json({ message: 'Duyệt thành viên thành công' });
  } catch (error) {
    next(error);
  }
};
exports.reject = async (req, res, next) => {
  try {
    console.log(req.params, req.body);
    let userId = req.user.id;
    const { groupId, userJoinIds } = req.body;

    const group = await Group.findOne({
      where: { id: groupId, state: GeneralConstants.STATE_GROUP.ACTIVATED },
    });
    if (!group) throw new Api404Error('Không tìm thấy nhóm');
    const checkRole = await GroupMember.findOne({
      where: { userId, groupId: group.id },
    });
    if (!checkRole) throw new Api404Error('Không tìm thấy nhóm');
    if (!checkRole.isAdmin)
      throw new api400Error('Không có quyền duyệt thành viên');

    const unapprovedMembers = await GroupMember.findAll({
      where: {
        id: {
          [Op.in]: userJoinIds,
        },
        groupId: group.id,
        isAdmin: false,
        state: GeneralConstants.STATE_MEMBER.PENDING,
      },
    });
    if (unapprovedMembers.length <= 0)
      throw new Api404Error('Không tìm thấy thành viên');
    const unapprovedMemberIds = unapprovedMembers.map(
      (unapprovedMember) => unapprovedMember.id
    );
    await GroupMember.update(
      { state: GeneralConstants.STATE_MEMBER.REJECTED },
      {
        where: {
          id: {
            [Op.in]: unapprovedMemberIds,
          },
        },
      }
    );

    res.status(200).json({ message: 'Từ chối thành viên thành công' });
  } catch (error) {
    next(error);
  }
};
exports.banMember = async (req, res, next) => {
  try {
    console.log(req.params, req.body);
    let userId = req.user.id;
    const { groupId, userJoinIds } = req.body;

    const group = await Group.findOne({
      where: { id: groupId, state: GeneralConstants.STATE_GROUP.ACTIVATED },
    });
    if (!group) throw new Api404Error('Không tìm thấy nhóm');
    const checkRole = await GroupMember.findOne({
      where: { userId, groupId: group.id },
    });
    if (!checkRole) throw new Api404Error('Không tìm thấy nhóm');
    if (!checkRole.isAdmin)
      throw new api400Error('Không có quyền duyệt thành viên');

    const unapprovedMembers = await GroupMember.findAll({
      where: {
        id: {
          [Op.in]: userJoinIds,
        },
        groupId: group.id,
        isAdmin: false,
      },
    });
    if (unapprovedMembers.length <= 0)
      throw new Api404Error('Không tìm thấy thành viên');
    const unapprovedMemberIds = unapprovedMembers.map(
      (unapprovedMember) => unapprovedMember.id
    );
    await GroupMember.update(
      { state: GeneralConstants.STATE_MEMBER.REJECTED },
      {
        where: {
          id: {
            [Op.in]: unapprovedMemberIds,
          },
        },
      }
    );

    res.status(200).json({ message: 'Cấm thành viên thành công' });
  } catch (error) {
    next(error);
  }
};
exports.deleteMember = async (req, res, next) => {
  try {
    console.log(req.params, req.body);
    let userId = req.user.id;
    const { groupId, userJoinIds } = req.body;

    const group = await Group.findOne({
      where: { id: groupId, state: GeneralConstants.STATE_GROUP.ACTIVATED },
    });
    if (!group) throw new Api404Error('Không tìm thấy nhóm');
    const checkRole = await GroupMember.findOne({
      where: { userId, groupId: group.id },
    });
    if (!checkRole) throw new Api404Error('Không tìm thấy nhóm');
    if (!checkRole.isAdmin)
      throw new api400Error('Không có quyền duyệt thành viên');

    const approvedMembers = await GroupMember.findAll({
      where: {
        id: {
          [Op.in]: userJoinIds,
        },
        groupId: group.id,
        isAdmin: false,
      },
    });
    if (approvedMembers.length <= 0)
      throw new Api404Error('Không tìm thấy thành viên');
    const approvedMemberIds = approvedMembers.map(
      (approvedMember) => approvedMember.id
    );
    await GroupMember.destroyMany({
      where: {
        id: {
          [Op.in]: approvedMemberIds,
        },
      },
    });

    res.status(200).json({ message: 'Xoá thành viên thành công' });
  } catch (error) {
    next(error);
  }
};
//get member of Group
exports.getMemberOfGroup = async (req, res, next) => {
  try {
    console.log(req.params, req.body);
    let userId = req.user.id;
    const { groupId, state = GeneralConstants.STATE_MEMBER.APPROVED } =
      req.body;

    const check = await Group.findOne({
      where: { id: groupId, state: GeneralConstants.STATE_GROUP.ACTIVATED },
    });
    if (!check) {
      throw new Api404Error('Không tìm thấy nhóm chat');
    }
    if (state !== GeneralConstants.STATE_MEMBER.APPROVED) {
      const checkRole = await GroupMember.findOne({
        where: { userId, groupId: check.id },
      });
      if (!checkRole) throw new Api404Error('Không tìm thấy nhóm');
      if (!checkRole.isAdmin)
        throw new api400Error('Không có quyền lấy danh sách thành viên');
    }
    const isMember = await GroupMember.findOne({
      where: { userId, groupId: check.id },
    });
    if (!isMember) {
      throw new Api404Error('Không tìm thấy nhóm này');
    }
    let members = await GroupMember.findAll({
      where: { groupId: check.id, state },
      include: [
        {
          model: User,
          attributes: [
            'fullName',
            'id',
            'username',
            'profilePicture',
            'coverPicture',
          ],
        },
      ],
    });
    const responseData = members.map((p) => {
      return {
        userId: p.userId,
        state: p.state,
        username: p.User.username,
        profilePicture: p.User.profilePicture,
        coverPicture: p.User.coverPicture,
        fullName: p.User.fullName,
      };
    });
    res.status(200).json({
      data: responseData,
      message: 'Lấy danh sách thành viên thành công',
    });
  } catch (error) {
    next(error);
  }
};

//new group chat

exports.create = async (req, res, next) => {
  try {
    let userIdsBody = req.body.users || [];
    userIdsBody = userIdsBody.filter((val) => val !== req.user.id);
    const group = await Group.create({ ...req.body, creatorId: req.user.id });
    const users = await User.findAll({
      where: {
        id: { [Op.in]: userIdsBody },
        isBlock: false,
      },
      attributes: ['id'],
    });
    const members = users.map((user) => {
      return {
        userId: user.id,
        groupId: group.id,
        isAdmin: false,
        state: GeneralConstants.STATE_MEMBER.APPROVED,
      };
    });
    const newGr = await GroupMember.create({
      userId: req.user.id,
      groupId: group.id,
      isAdmin: true,
      state: GeneralConstants.STATE_MEMBER.APPROVED,
    });
    await GroupMember.bulkCreate(members);
    res.status(200).json({ message: 'Create group successfully', data: group });
  } catch (error) {
    next(error);
  }
};
exports.getOne = async (req, res, next) => {
  try {
    const id = req.params.id;
    const userId = req.user.id;

    let group = await Group.findByPk(id, {
      where: {
        state: GeneralConstants.STATE_GROUP.ACTIVATED,
      },
      include: [
        {
          model: GroupMember,
          where: {
            userId,
          },
        },
      ],
    });
    if (!group) throw new Api404Error('not found group');
    const dataResponse = {
      id: group.id,
      img: group.img,
      title: group.title,
      type: group.type,
      isAdmin: _.get(group, 'GroupMembers.0.isAdmin', false),
      state: _.get(group, 'GroupMembers.0.state', null),
    };

    res.status(200).json({ data: dataResponse });
  } catch (error) {
    next(error);
  }
};
exports.query = async (req, res, next) => {
  try {
    const page = parseInt(_.get(req, 'query.page', 0));
    let limit = +req.query.limit || 10;
    let offset = 0 + page * limit;
    let textSearch = req.query.textSearch || '';
    console.log('page', page);
    console.log('limit', limit);
    console.log('offset', offset);
    const userId = req.user.id;
    let where = {
      state: GeneralConstants.STATE_GROUP.ACTIVATED,
    };
    let whereGroupMember = {};
    if (!_.isEmpty(textSearch)) {
      const result = await client.search({
        index: 'groups',
        type: 'groups',
        body: {
          query: {
            match: { title: textSearch },
          },
        },
      });

      const ids = result.hits.hits.map((item) => {
        return item._id;
      });
      where = {
        ...where,
        id: {
          [Op.in]: ids,
        },
      };
    } else {
      whereGroupMember = {
        state: GeneralConstants.STATE_MEMBER.APPROVED,
        userId,
      };
    }
    let dateFrom = moment().subtract(7, 'd').format('YYYY-MM-DD');
    const groups = await Group.findAll({
      subQuery: false,
      where,
      attributes: {
        include: [
          [sequelize.literal('COUNT(DISTINCT(posts.id))'), 'numPost7DayLatest'],
        ],
        // include: [
        //   [
        //     sequelize.literal('COUNT(DISTINCT(GroupMembers.userId))'),
        //     'numMember',
        //   ],
        // ],
      },
      include: [
        {
          model: GroupMember,
          attributes: [],
          where: whereGroupMember,
        },
        {
          association: 'posts',
          attributes: [],
          where: {
            createdAt: {
              [Op.gte]: dateFrom,
            },
          },
        },
      ],
      // order: [
      //   [sequelize.literal('COUNT(DISTINCT(GroupMembers.userId))'), 'DESC'],
      // ],
      group: 'id',
      limit,
      offset,
    });
    const length = await Group.count({
      where,
    });

    res.status(200).json({ data: groups, length });
  } catch (error) {
    next(error);
  }
};
exports.get = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const page = parseInt(_.get(req, 'query.page', 0));
    let limit = +req.query.limit || 10;
    let offset = 0 + page * limit;
    let textSearch = req.query.textSearch || '';
    console.log('page', page);
    console.log('limit', limit);
    console.log('offset', offset);

    const groupIds = await sequelize.query(
      `SELECT p.groupId  FROM GroupMembers p
      JOIN Groups g on p.groupId = g.id
      WHERE p.userId = ${userId}, p.state = ${GeneralConstants.STATE_MEMBER.APPROVED}, g.state = ${GeneralConstants.STATE_GROUP.ACTIVATED}
      `,
      {
        type: QueryTypes.SELECT,
      }
    );
    console.log(groupIds);
    const groups = await Group.findAll({
      where: {
        id: {
          [Op.in]: groupIds,
        },
        state: GeneralConstants.STATE_GROUP.ACTIVATED,
      },
    });

    // const userPost = await Post.findAll({ where: { userId: user.id } });

    res.status(200).json({ data: groups });
  } catch (error) {
    next(error);
  }
};
exports.getAll = async (req, res, next) => {
  try {
    const groups = await Group.findAll();

    // const userPost = await Post.findAll({ where: { userId: user.id } });

    res.status(200).json({ data: groups });
  } catch (error) {
    next(error);
  }
};
