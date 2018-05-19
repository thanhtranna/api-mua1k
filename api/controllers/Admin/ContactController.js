/**
 * AuctionController
 *
 * @description :: Server-side logic for managing contacts
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

  /**
   * Get all Contacts
   * @Query params:
   *    {number} page: page number in pagination
   * @Polices
   *    verifyToken
   * @return {json}
   */
  getContacts: asyncWrap(async (req, res) => {
    const page = req.query.page || 1;
    const contacts = await ContactRepository.getContacts(page);

    res.ok({ data: contacts });
  }),

  /**
   * Get detail contact
   */
  getContact: asyncWrap(async (req, res) => {
    const contactId = req.params.id;
    const contact = await Contact
      .findById({ '_id': contactId })
      .populate(['category', 'user'])
      .select('-__v');
    res.ok({ data: contact });
  }),

  /**
   * Reply contact
   */
  postReplyContact: asyncWrap(async (req, res) => {
    const params = req.body;
    const id = req.params.id;
    // Fire Event 'account.register.resendEmail'
    EventEmitter.emit('replyContact', params);
    await Contact.findByIdAndUpdate({ _id: id }, { $set: { isHandle: true } });
    res.ok({});
  }),

  /**
   * Delete contact
   */
  deleteContact: asyncWrap(async (req, res) => {
    let contactId = req.params.id;
    let contact = await ContactRepository.deleteContact(contactId);
    res.ok({ data: contact });
  }, (req, res, error) => {
    if (error.code === sails.errors.deleteContactFail.code)
      return res.badRequest(sails.errors.deleteContactFail);
    res.serverError(error);
  }),
};

