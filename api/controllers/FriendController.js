/**
 * FriendController
 *
 * @description :: Server-side logic for managing Friends
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
  /**
   * Function topInviteList
   * @description Get top invite friend.
   */

  topInviteList: asyncWrap(async (req, res) => {
    let users = await FriendRepository.topInviteList();
    return res.ok({ data: users });
  })
};
