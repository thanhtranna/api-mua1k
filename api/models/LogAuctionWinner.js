'use strict';
const mongoose = require('mongoose');
const mongoosePagination = require('mongoose-paginate');

const statusWinner = {
  default: 0,
  transfering: 1,
  successfull: 2,
  fails: 3
};

const LogAuctionWinnerSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.ObjectId, ref: 'User' },
    auction: { type: mongoose.Schema.ObjectId, ref: 'Auction' },
    luckyNumber: { type: String },
    numberA: { type: String },
    numberB: { type: String },
    finishAt: { type: Date },
    isCard: { type: Boolean, default: false },
    statusWinner: { type: Number, default: 0 }
  },
  { timestamps: true }
);

LogAuctionWinnerSchema.plugin(mongoosePagination);
module.exports = mongoose.model('LogAuctionWinner', LogAuctionWinnerSchema);
module.exports.statusWinner = statusWinner;
