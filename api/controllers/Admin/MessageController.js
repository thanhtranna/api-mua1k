'use strict';

const popMessageCategory = { path: 'category', select: '_id name icon' };

module.exports = {
  /**
   * Get all messages
   * @Query params:
   *    {number} page: page number in pagination,
   * @Polices
   *    verifyToken.js
   * @return {json}
   */
  getMessages: asyncWrap(async (req, res) => {
    const page = req.query.page || 1;
    const messages = await Message.paginate(
      {},
      sails.helpers.optionPaginateAdmin(req, popMessageCategory, page)
    );
    res.ok({ data: messages });
  }),

  /**
   * Detail a message
   * @Route params:
   *    {ObjectId} id: id of message
   * @Polices
   *    verifyToken.js,
   *    validator/message/messageExit.js
   * @return {json}
   */
  getMessage: asyncWrap(async (req, res) => {
    const { id } = req.params;
    const message = await Message.findById(id).populate(popMessageCategory);
    res.ok({ data: message });
  }),

  /**
   * Create new a message
   * @Request params:
   *    {String}   title           : title of message | required
   *    {String}   description     : description of message | required
   *    {ObjectId}   category     : id of message-category | required
   * @Polices
   *    verifyToken.js,
   *    validator/message/createMessage
   *    validator/message/categoryExist.js
   * @return {json}
   */
  postCreate: asyncWrap(async (req, res) => {
    const message = req.body;
    const newMessage = await Message.create(message);
    res.ok({ data: newMessage });
  }),

  /**
   * Update message
   * @Router params:
   *    {ObjectId} id : id of message
   * @Request params:
   *    {String}   title            : title of message
   *    {String}   description     : description of message
   *    {Boolean}   status           : status =1 : display
   * @Polices
   *    verifyToken.js,
   *    validator/message/messageExist
   *    validator/message/updateMessage
   * @return {json}
   */
  putUpdate: asyncWrap(async (req, res) => {
    const { id } = req.params;
    const message = req.body;
    const newMessage = await Message.findByIdAndUpdate(
      id,
      { $set: message },
      { new: true }
    ).populate(popMessageCategory);
    res.ok({ data: newMessage });
  }),

  /**
   * Delete soft a message, update field deletedAt by now a day
   * @Query params: null
   * @Route params:
   *      {ObjectId} id: id of message,
   * @Polices
   *    verifyToken.js,
   *    validator/message/messageExist
   * @return {json}
   */
  deleteMessage: asyncWrap(async (req, res) => {
    const { id } = req.params;
    const newMessage = await Message.findByIdAndUpdate(
      id,
      { $set: { deletedAt: new Date() } },
      { new: true }
    );
    res.ok({ data: newMessage });
  }),

  /**
   * Filter message by category
   * @Query params:
   *      {Number} page : page in pagination
   * @Body params:
   *      {ObjectId} category: id of collection message-category,
   * @Polices
   *    verifyToken.js,
   *    validator/message/categoryExist.js
   * @return {json}
   */
  filterMessage: asyncWrap(async (req, res) => {
    const id = req.param('category');
    const query = { category: id };
    const messages = await Message.paginate(
      query,
      sails.helpers.optionPaginateAdmin(req, popMessageCategory)
    );
    res.ok({ data: messages });
  }),

  getCategoryMessage: asyncWrap(async (req, res) => {
    const categoryMessage = await MessageCategory.find();
    res.ok({ data: categoryMessage });
  })
};
