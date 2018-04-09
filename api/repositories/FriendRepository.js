/**
 * Created by daulq on 9/14/17.
 */
const fieldUser = "id nickname email uid";
module.exports = {

    /**
     * Function friendListByUser.
     * @description Get list friend of user.
     * @param {ObjectId()} user id of user
     * @returns {Promise.<*>}
     */

    friendListByUser: async(user) => {
        return await UserFriend.find({user}).populate([
            {
                path: "friend.user",
                select: fieldUser
            },
            {
                path: "user",
                select: fieldUser
            }
            ]);
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
    }
}