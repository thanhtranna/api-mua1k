/**
 * Created by daulq on 9/13/17.
 */

const moment = require("moment");

module.exports = {

    /**
     * Function pointByUser.
     * @description get point of user.
     * @param user
     * @returns {Promise.<*>}
     */

    pointByUser: async (user) => {
        try {
            let userPoint = await UserPoint.findOne({user});
            if(userPoint) {
                return userPoint.point;
            }
            return 0;
        } catch (error) {
            throw error;
        }

    },

    /**
     * Function pointHistoryByUser
     * @description Get history receive point
     * @param user
     * @returns {Promise.<*>}
     */

    pointHistoryByUser: async (user) => {
        try {
            const fieldLog = "-updatedAt -__v -user";
            const fieldUser = "_id email nickname uid";
            const data = await LogUserPoint.find({user, $or: [{task: 2}, {task: 5}]})
                .select(fieldLog)
                .populate([
                    {
                        path:"from",
                        select:fieldUser
                    }
                ]);
            console.log('Data point history: ', data);
            return data;
        } catch(error) {
            throw error;
        }
    },

    /**
     * Function checkin
     * @description User checkin when login app
     * @param {ObjectId()} user
     * @returns {Promise.<boolean>}
     */

    checkin: async (user) => {
        try {
            let task = await Task.findOne({_id:1});
            let isCheckin = false;
            let logUserTask = await LogUserTask.findOne({user, task:task._id});
            if(logUserTask) {
                let expiredAt = moment(logUserTask.updatedAt);
                let numberExpiredAt = expiredAt.format('YYYYMMDD');
                let nextExpiredAt = moment(logUserTask.updatedAt).add(1, 'days');
                let numberNextExpiredAt = nextExpiredAt.format('YYYYMMDD');
                let currentDate = moment(new Date());
                let numberCurrentDate = currentDate.format('YYYYMMDD');
                if (numberExpiredAt === numberCurrentDate) {
                    isCheckin = false;
                } else if (numberNextExpiredAt === numberCurrentDate) {
                    let query = {
                        $set:{
                            value:logUserTask.value+1
                        }
                    };
                    await LogUserTask.update({user, task:task._id}, query);
                    isCheckin = true;
                } else {
                    let query = {
                        $set:{
                            value:1
                        }
                    };
                    await LogUserTask.update({user, task:task._id}, query);
                    isCheckin = true;
                }
            } else {
                let data = {
                    user,
                    task: task._id,
                    value: 1
                };
                await LogUserTask.create(data);
                isCheckin = true;
            }

            // Save log user receive point

            if(isCheckin === true) {
                let userPoint = await UserPoint.findOne({user});
                if(userPoint) {
                    let point = userPoint.point + task.point;
                    await UserPoint.update({user}, {$set: {point}});
                } else {
                    let data = {
                        user,
                        point: task.point
                    };
                    await UserPoint.create(data);
                }
                let dataLogUserPoint = {
                    user,
                    point: task.point,
                    from: mongoose.Schema.Types.ObjectId(0),
                    task: task._id
                };
                await LogUserPoint.create(dataLogUserPoint);
                return true;
            } else {
                return false;
            }

        } catch(error) {
            throw error;
        }
    },

    /**
     * Function pointViaInviteFriend.
     * @description point receive via invite friend.
     * @param userInviteId
     * @param user
     * @returns {Promise.<*>}
     */

    pointViaInviteFriend: async(userInviteId, user) => {
        let userInvite = await User.findOne({uid: userInviteId}).lean(true);
        if(!userInvite) {
            return res.badRequest(sails.errors.userInviteIdNotExist);
        }

        // Add friend level 1

        let checkFriend = await UserFriend.findOne({user:userInvite._id, "friends.user": user._id}).lean(true);
        if(!checkFriend) {
            let friends = await UserFriend.findOne({user:userInvite._id});
            if(!friends) {

                await UserFriend.create({
                    user:userInvite._id,
                    friends: [{
                        user: user._id,
                        status: 1
                    }],
                    totalFriend: 1,
                    totalBestFriend: 1
                })
            } else {
                let listFriends = friends.friends;
                listFriends.push({
                    user: user._id,
                    status: 1
                });
                let totalFriend = listFriends.length;
                let totalBestFriend = friends.totalBestFriend+1;
                friends.totalFriend = totalFriend;
                friends.totalBestFriend = totalBestFriend;
                friends.friends = listFriends;
                await friends.save();
            }

            // Coin level 1

            let userPoint = await UserPoint.findOne({user:userInvite._id});
            if(!userPoint) {
                UserPoint.create({
                    user: userInvite._id,
                    point: UserPoint.friend.best
                });
            } else {
                userPoint.point = userPoint.point + UserPoint.friend.best;
                userPoint.save();
            }

            // Save log receive point

            await LogUserPoint.create({
                user:userInvite._id,
                point: UserPoint.friend.best,
                from: user._id,
                task: 2
            });

            // Point level 2
            if(userInvite.invitationUserId !== undefined && userInvite.invitationUserId !== null) {
                userInvite = await User.findOne({uid: userInvite.invitationUserId}).lean(true);
                if(userInvite) {
                    sails.log.info(userInvite);
                    // Add friend level 2
                    let friends = await UserFriend.findOne({user:userInvite._id});
                    if(!friends) {

                        await UserFriend.create({
                            user:userInvite._id,
                            friends: [{
                                user: user._id,
                                status: 2
                            }],
                            totalFriend: 1,
                            totalGoodFriend: 1
                        })
                    } else {
                        let listFriends = friends.friends;
                        listFriends.push({
                            user: user._id,
                            status: 2
                        });
                        let totalFriend = listFriends.length;
                        let totalGoodFriend = friends.totalGoodFriend+1;
                        friends.totalFriend = totalFriend;
                        friends.totalGoodFriend = totalGoodFriend;
                        friends.friends = listFriends;
                        await friends.save();
                    }

                    let userPoint = await UserPoint.findOne({user:userInvite._id});
                    if(!userPoint) {
                        UserPoint.create({
                            user: userInvite._id,
                            point: UserPoint.friend.good
                        });
                    } else {
                        userPoint.point = userPoint.point + UserPoint.friend.good;
                        userPoint.save();
                    }

                    // Save log receive point

                    await LogUserPoint.create({
                        user:userInvite._id,
                        point: UserPoint.friend.good,
                        from: user._id,
                        task:2
                    });

                    // Point level 3

                    if(userInvite.invitationUserId !== undefined && userInvite.invitationUserId !== null) {
                        userInvite = await User.findOne({uid: userInvite.invitationUserId}).lean(true);
                        if(userInvite) {
                            // Add friend level 3
                            let friends = await UserFriend.findOne({user:userInvite._id});
                            if(!friends) {

                                await UserFriend.create({
                                    user:userInvite._id,
                                    friends: [{
                                        user: user._id,
                                        status: 3
                                    }],
                                    totalFriend: 1,
                                    totalNormalFriend: 1
                                })
                            } else {
                                let listFriends = friends.friends;
                                listFriends.push({
                                    user: user._id,
                                    status: 3
                                });
                                let totalFriend = listFriends.length;
                                let totalNormalFriend = friends.totalNormalFriend+1;
                                friends.totalFriend = totalFriend;
                                friends.totalNormalFriend = totalNormalFriend;
                                friends.friends = listFriends;
                                await friends.save();
                            }

                            let userPoint = await UserPoint.findOne({user:userInvite._id});
                            if(!userPoint) {
                                UserPoint.create({
                                    user: userInvite._id,
                                    point: UserPoint.friend.normal
                                });
                            } else {
                                userPoint.point = userPoint.point + UserPoint.friend.normal;
                                userPoint.save();
                            }

                            // Save log receive point

                            await LogUserPoint.create({
                                user:userInvite._id,
                                point: UserPoint.friend.normal,
                                from: user._id,
                                task: 2
                            });
                        }
                    }
                }
            }

        }
    }

};
