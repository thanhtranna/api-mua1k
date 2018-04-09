"use strict";

module.exports = {

    /**
     * Function getProfile.
     * @description get profile of user
     * @param {Object()} _id id of user
     * @returns {*|Query}
     */

    getProfile: (_id) => {
        let fieldSelect = "id uid nickname avatar email coin";
        return User.findOne({_id}, fieldSelect).lean(true);
    },

    isCheckin: async (user) => {
        let checkin = await LogUserTask.findOne({user, task:1}).lean(true);
        if(!checkin) {
            return false;
        }
        let updatedAt = new Date(checkin.updatedAt).getTime();
        let nows = new Date().getTime();
        let diff = (nows - updatedAt)/24/60/60/1000;
        return diff < 1;

    },

    /**
     * Function getCoin
     * @description get coin of user.
     * @param {ObjectId()} id of user.
     * @returns {*|Query}
     */

    getCoin: async (id) => {
        let userCoin = await UserCoin.findOne({user: id}).lean(true);
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
                    deletedAt: {$ne: undefined}
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
     * Function changeNickname
     * @description change nickname of user
     * @param {String} nickname
     * @param {ObjectId()} id
     * @returns {Promise.<Query>}
     */

    changeNickname: async(nickname, id) => {
        await User.update({_id:id}, {nickname});
        let fieldUser = "id nickname email avatar";
        return await User.findOne({_id:id}).select(fieldUser);
    },


    /**
     * Get user point
     * @param id: user id
     */
    getPoint: async (id) => {
        let userCoin = await UserPoint.findOne({user: id}).lean(true);
        return userCoin ? userCoin.point : 0;
    },
};
