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
        const user = req.user._id;
        const type = req.query.type;
        const discountTickets = await DiscountTicketRepository.discountTicketByUser(user, type);
        return res.ok({data:discountTickets});
    })
};

