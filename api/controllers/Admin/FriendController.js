/**
 * FriendController
 *
 * @description :: Server-side logic for managing Friends
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

    getFriendByUser: asyncWrap(async(req, res) => {
        let userid = req.params.userid;
        let users = await FriendRepository.getFriendByUser(userid);
        return res.ok({data: users});
    })
};

