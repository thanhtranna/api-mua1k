/**
 * UserDiscountTicket.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

const UserDiscountTicketSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
    },
    expiredAt: {
        type: Date,

    }
}, {
    timestamps: true
});

module.exports = mongoose.model("UserDiscountTicket", UserDiscountTicketSchema);

