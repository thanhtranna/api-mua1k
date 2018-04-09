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

    discountTicketByUser: async(user) => {
        try {
            let fieldDiscount = "-__v -createdAt -updatedAt";
            let fieldProduct = "id name description image";
            let fieldCondition = "value";
            return await UserDiscountTicket.find({user})
                .select(fieldDiscount)
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
    }
 };