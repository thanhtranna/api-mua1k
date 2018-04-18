/**
 * DiscountTicketController
 *
 * @description :: Server-side logic for managing Discounttickets
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
  /**
   * Function discountTicketByUser.
   * @description Get list discount ticket of user
   * @policies
   *   verifyToken
   */

  discountTicketByUser: asyncWrap(async (req, res) => {
    const user = req.params.userid;
    const page = req.query.page || 1;
    let selectFields = '-__v';
    const populate = [
      {
        path: 'user',
        select: 'nickname'
      },
      {
        path: 'product',
        select: 'name'
      }
    ];

    const option = sails.helpers.optionPaginate(page, selectFields, populate);
    const discountTickets = await UserDiscountTicket.paginate(
      {
        user: user
      },
      option
    );
    return res.ok({ data: discountTickets });
  })
};
