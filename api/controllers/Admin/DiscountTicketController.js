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
        let user = req.params.userid;
        let page = req.query.page || 1;
        let selectFields = '-__v';
        let populate = [{
                path: 'user',
                select: 'nickname'
            },
            {
                path: 'product',
                select: 'name'
        }];

        let option = sails.helpers.optionPaginate(page, selectFields, populate);
        let discountTickets = await UserDiscountTicket.paginate({
            user: user
        }, option);
        return res.ok({data:discountTickets});
    })
};

