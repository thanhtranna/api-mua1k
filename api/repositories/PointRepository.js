/**
 * Created by daulq on 9/13/17.
 */

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
            let fieldLog = "-updatedAt -__v -user";
            let fieldUser = "_id email nickname uid";
            return await LogUserPoint.find({user, $or: [{task: 2}, {task: 5}]})
                .select(fieldLog)
                .populate([
                    {
                        path:"from",
                        select:fieldUser
                    }
                ]);
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
                // Check time user checkin
                let updatedAt;
                updatedAt = new Date(logUserTask.updatedAt).getTime();
                let nows = new Date().getTime();
                let diff = (nows - updatedAt)/24/60/60/1000;
                if(diff >=2) {
                    let query = {
                        $set:{
                            value:1
                        }
                    };
                    await LogUserTask.update({user, task:task._id}, query);
                    isCheckin = true;
                } else {
                    if(diff >= 1 && diff < 2) {
                        let query = {
                            $set:{
                                value:logUserTask.value+1
                            }
                        };
                        await LogUserTask.update({user, task:task._id}, query);
                        isCheckin = true;
                    }
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
                    totalFriend: 1
                })
            } else {
                let listFriends = friends.friends;
                listFriends.push({
                    user: user._id,
                    status: 1
                });
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