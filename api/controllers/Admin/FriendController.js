/**
 * FriendController
 *
 * @description :: Server-side logic for managing Friends
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
  getFriendByUser: asyncWrap(async (req, res) => {
    const { userid } = req.params;
    const users = await FriendRepository.getFriendByUser(userid);
    return res.ok({ data: users });
  })
};
