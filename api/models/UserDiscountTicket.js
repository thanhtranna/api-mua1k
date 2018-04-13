/**
 * UserDiscountTicket.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

const mongoose = require("mongoose");
const mongoosePaginate = require('mongoose-paginate');

const types = {
    expired: 0,
    notExpire: 1,
};

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
    },
    deletedAt: {
        type: Date
    }
}, {
    timestamps: true
});

UserDiscountTicketSchema.plugin(mongoosePaginate);


module.exports = mongoose.model("UserDiscountTicket", UserDiscountTicketSchema);
module.exports.types = types;
