"use strict";

const moment = require("moment");

module.exports = {

  /**
   * Function getProfile.
   * @description get profile of user
   * @param {Object()} _id id of user
   * @returns {*|Query}
   */

  getProfile: (_id) => {
    let fieldSelect = "id uid nickname avatar email coin deviceToken";
    return User.findOne({ _id }, fieldSelect).lean(true);
  },

  isCheckin: async (user) => {
    let isCheckin = false;
    let checkin = await LogUserTask.findOne({ user, task: 1 }).lean(true);
    if (!checkin) {
      return false;
    }
    let expiredAt = moment(checkin.updatedAt);
    let numberExpiredAt = expiredAt.format('YYYYMMDD');
    let currentDate = moment(new Date());
    let numberCurrentDate = currentDate.format('YYYYMMDD');
    if (numberExpiredAt === numberCurrentDate) {
      isCheckin = true;
    }
    return isCheckin;

  },

  /**
   * Function getCoin
   * @description get coin of user.
   * @param {ObjectId()} id of user.
   * @returns {*|Query}
   */

  getCoin: async (id) => {
    let userCoin = await UserCoin.findOne({ user: id }).lean(true);
    return userCoin ? userCoin.coin : 0;
  },

  /**
   * Function getUser
   * @description Get profile of user
   * @param {ObjectId()} id id of user
   */

  getUser: (id) => {
    return User.findById(id).populate('address');
  },

  /**
   * Function getUsers.
   * @param {Number} page
   * @returns {Promise.<*|Promise>}
   */

  getUsers: async (page = 1) => {
    let option = sails.helpers.optionPaginateUser(page);
    let users = await User.paginate({}, option);
    return users;
  },

  /**
   * Function filter user.
   * @param {String} type
   * @param {Number} page
   * @returns {Promise.<*|Promise>}
   */

  filterUsers: async (type, page = 1) => {
    let query = {};
    switch (type) {
      case 'blocked':
        query = {
          isBlocked: true,
        };
        break;
      case 'deleted':
        query = {
          deletedAt: { $ne: undefined }
        };
        break;
    }
    let option = sails.helpers.optionPaginateUser(page);
    let users = await User.paginate(query, option);
    return users;
  },

  /**
   * Function search user.
   * @param {String} type
   * @param {String} value
   * @param {Number} page
   * @returns {Promise.<*|Promise>}
   */

  searchUsers: async (type, value, page = 1) => {
    let query = {};
    switch (type) {
      case 'email':
        query = { email: value };
        break;
      case 'name':
        query = { nickname: new RegExp(value) };
        break;
    }
    let option = sails.helpers.optionPaginateUser(page);
    let users = await User.paginate(query, option);
    return users;
  },
  /**
   * Function filter user.
   * @param {String} type
   * @param {Number} page
   * @returns {Promise.<*|Promise>}
   */
  filterUsersAdmin: async (type, page = 1) => {
    let query = {};
    switch (type) {
      case `${sails.config.user.normal}`:
        query = {
          isBlocked: false,
          deletedAt: { $eq: undefined }
        };
        break;
      case `${sails.config.user.all}`:
        break;
      case `${sails.config.user.blocked}`:
        query = {
          isBlocked: true,
        };
        break;
      case `${sails.config.user.deleted}`:
        query = {
          deletedAt: { $ne: undefined }
        };
        break;
    }
    let option = sails.helpers.optionPaginateUser(page);
    let users = await User.paginate(query, option);
    return users;
  },

  /**
   * Function search user.
   * @param {String} value
   * @param {Number} page
   * @returns {Promise.<*|Promise>}
   */

  searchUsersAdmin: async (value, page = 1) => {
    let query = {};
    if (typeof value !== 'undefined') {
      query = {
        $or: [
          { email: new RegExp(value) },
          { nickname: new RegExp(value) }
        ]
      };
    }
    let option = sails.helpers.optionPaginateUser(page);
    let users = await User.paginate(query, option);
    return users;
  },


  /**
   * Function changeNickname
   * @description change nickname of user
   * @param {String} nickname
   * @param {ObjectId()} id
   * @returns {Promise.<Query>}
   */

  changeNickname: async (nickname, id) => {
    await User.update({ _id: id }, { nickname });
    const fieldUser = "id uid nickname email avatar";
    return await User.findOne({ _id: id }).select(fieldUser);
  },


  /**
   * Get user point
   * @param id: user id
   */
  getPoint: async (id) => {
    const userPoint = await UserPoint.findOne({ user: id }).lean(true);
    return userPoint ? userPoint.point : 0;
  },

  /**
   * Get user coin
   * @param id: user id
   */

  getCoin: async (id) => {
    const userCoin = await UserCoin.findOne({ user: id }).lean(true);
    return userCoin ? userCoin.coin : 0;
  },

  /**
   * Get number Date consecutive checkin
   * @param id: user id
   */
  getNumberDateCheckin: async (user) => {
    let checkin = await LogUserTask.findOne({ user, task: 1 }).lean(true);
    if (!checkin) {
      let notCheckin = 0;
      return notCheckin;
    }
    return checkin.value;
  },

  /**
   * Delete device token
   */
  deleteDeviceToken: async (id) => {
    try {
      return await User.findByIdAndUpdate({ _id: id }, { $set: { deviceToken: null } }, { new: true });
    } catch (error) {
      throw error;
    }
  }
};
