/**
 * Created by daulq on 9/15/17.
 */
module.exports = {

    /**
     * Function discountTicketByUser.
     * @description Get discount ticket of user
     * @param {ObjectId()} user
     * @returns {Promise.<*>}
     */

    discountTicketByUser: async(user, type) => {
        try {
            let fieldDiscount = "-__v -createdAt -updatedAt";
            let fieldProduct = "id name description featureImage value";
            let fieldCondition = "value";
            let query = {};

            if (parseInt(type) === UserDiscountTicket.types.expired) {
                query = {
                    user: user,
                    deletedAt: {$exists: false},
                    expiredAt: { $lt: new Date() }
                };
            } else if (parseInt(type) === UserDiscountTicket.types.notExpire){
                query = {
                    user: user,
                    deletedAt: {$exists: false},
                    expiredAt: { $gte: new Date() }
                };
            }
            return await UserDiscountTicket.find(query)
                .select(fieldDiscount)
                .sort({createdAt: -1})
                .populate([
                    {
                        path: "product",
                        select: fieldProduct,
                        populate: {
                            path: "condition",
                            select: fieldCondition
                        }
                    }
                ]);
        } catch (error) {
            throw error;
        }
    },

    /**
     * Check if discount ticket exist or not delete
     */
    isDiscountTicketExist: async (discountTicketId) => {
        try {
            let isDiscountTicketExist = await UserDiscountTicket.count({
                _id: discountTicketId,
                deletedAt: {$exists: false}
            });
            return !!isDiscountTicketExist;
        }
        catch (error) {
            throw error;
        }
    },

    /**
     * Check if discount ticket expired
     */
    isDiscountTicketExpire: async (discountTicketId) => {
        let isDiscountTicketExpire = await UserDiscountTicket.count({
            _id: discountTicketId,
            deletedAt: {$exists: false},
            expiredAt: {$gte: new Date()}
        });
        console.log(isDiscountTicketExpire)
        return !!isDiscountTicketExpire;
    },

    /**
     * get Discount ticket validation
     */
    findDiscountTicketValidate: async (discountTicketId) => {
        try {
            let discountTicket = await UserDiscountTicket.findOne({
                _id: sails.helpers.toObjectId(discountTicketId),
                deletedAt: {$exists: false}
            })
                .populate('product', 'name')
                .select('product');
            return discountTicket;
        } catch (error) {
            throw error;
        }
    },

    /**
     *
     */
    removeDiscountTicket: async (discountTickets) => {
        try {
            let deleteDiscountTickets = [];
            for (let i = 0; i < discountTickets.length; i++) {
                let discountTicketId = discountTickets[i].id;
                let discountTicket = await UserDiscountTicket.findByIdAndUpdate({
                    _id: discountTicketId
                }, {$set: {deletedAt: new Date()}}, {new: true});
                deleteDiscountTickets.push(discountTicket);
            }
            return deleteDiscountTickets;
        } catch (error) {
            throw error;
        }
    },

    /**
     *
     */
    getValueDiscount: async (discountTicketId) => {
        try {
            let discountTicket = await UserDiscountTicket.findOne({
                _id: discountTicketId,
                deletedAt: {$exists: false},
                expiredAt: {$gte: new Date()}
            }).populate('product', 'value');
            return discountTicket.product.value;
        } catch (error) {
            throw error;
        }
    }
};
