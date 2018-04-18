/**
 * MessageController
 *
 * @description :: Server-side logic for managing Messages
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
  /**
   * Function sendMessage.
   * @description Send message chat.
   * @body params:
   *   {String} message message chat of user
   *   {Number} type type of message. 1 - message text. 2 - sticker
   * @policies
   *   verifyToken
   *   validator/message/sendMessage
   */

  sendMessage: asyncWrap(async (req, res) => {
    let message = req.body.message;
    let type = req.body.type;
    let user = req.user;
    await MessageRepository.sendMessage(user, message, type);
    return res.ok();
  }),

  /**
   * Function getMessages.
   * @description get messages chat
   * @policies
   *   verifyToken
   */

  getMessages: asyncWrap(async (req, res) => {
    let timestamp = req.query.timestamp ? req.query.timestamp : new Date();
    let messages = await MessageRepository.getMessages(timestamp);
    return res.ok({ data: messages });
  })
};
