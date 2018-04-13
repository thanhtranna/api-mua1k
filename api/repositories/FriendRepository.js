/**
 * Created by daulq on 9/14/17.
 */
const fieldUser = "id nickname email uid createdAt";
module.exports = {

    /**
     * Function friendListByUser.
     * @description Get list friend of user.
     * @param {ObjectId()} user id of user
     * @returns {Promise.<*>}
     */

    friendListByUser: async(user) => {
        let userFriends = await UserFriend.findOne({user}).populate([
            {
                path: "user",
                select: fieldUser
            },
            {
                path: "friends.user",
                select: fieldUser
            }
            ]).select("-__v -createdAt -updatedAt").lean(true);
        if (!userFriends) {
            throw sails.helpers.generateError({
                code: sails.errors.userWithoutAnyFriend.code,
                message: 'Without any friend'
            });
        }
        let friends = userFriends.friends;
        for(let i in friends) {
            let userPoint = await UserPoint.aggregate([
                {
                    $match: {
                        user: user,
                        from: friends[i].user._id,
                        $or: [
                            {task: 2},
                            {task: 5}
                        ]
                    }
                },
                {
                    $group: {
                        _id: "$from",
                        totalPoint: {$sum: "$point"}
                    }
                }
            ]);
            if(userPoint.length !== 0) {
                friends[i].point = userPoint[0].totalPoint;
            } else {
                friends[i].point = 0;
            }
        }
        userFriends.friends = friends;
        return userFriends;
    },

    /**
     * Function topInviteList
     * @description Get top invite friend.
     * @returns {Promise.<*>}
     */

    topInviteList: async() => {
        return await UserFriend.find({}).select('id user totalFriend').populate({
            path: 'user',
            select: fieldUser
        }).limit(10).sort({totalFriend:1});
    },

    getFriendByUser: async(userid) => {
        try {
            return await UserFriend.findOne({user:userid}).populate([{
                    path: 'user',
                    select: '_id nickname'
                },
                {
                    path: 'friends.user',
                    select: '-__v'
                }
            ]);
        } catch (error) {
            throw error;
        }
    }
}
