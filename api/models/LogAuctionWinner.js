"use strict";
const mongoose = require('mongoose');
const mongoosePagination = require("mongoose-paginate");

const LogAuctionWinnerSchema = new mongoose.Schema({
    user       : {type: mongoose.Schema.ObjectId, ref: 'User' },
    auction    : {type: mongoose.Schema.ObjectId, ref: 'Auction' },
    luckyNumber: {type: String},
    numberA    : {type: String},
    numberB    : {type: String},
    finishAt   : {type: Date}
}, { timestamps: true });

LogAuctionWinnerSchema.plugin(mongoosePagination);
module.exports = mongoose.model('LogAuctionWinner', LogAuctionWinnerSchema);
