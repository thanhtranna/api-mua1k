'use strict';
const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate');

const status = {
  fail: -1,
  waiting: 1,
  running: 2,
  finished: 3
};

const types = {
  popular: 1,
  expiringSoon: 2,
  latest: 3,
  highPrice: 4,
  lowPrice: 5
};

const AuctionSchema = new mongoose.Schema(
  {
    aid: { type: Number },
    product: { type: mongoose.Schema.ObjectId, required: true, ref: 'Product' },
    chanceNumber: { type: Number, required: true },
    luckyNumber: { type: Number },
    firstBuy: { type: mongoose.Schema.ObjectId, ref: 'UserChanceBuy' },
    mostBuy: { type: mongoose.Schema.ObjectId, ref: 'UserChanceBuy' },
    lastBuy: { type: mongoose.Schema.ObjectId, ref: 'UserChanceBuy' },
    isImmediateBuy: { type: Boolean, default: false },
    status: { type: Number, enum: [-1, 1, 2, 3] },
    is1kYen: { type: Boolean, default: false },
    isSuggest: { type: Boolean, default: false },
    finishAt: { type: Date },
    startAt: { type: Date },
    expiredAt: { type: Date },
    deletedAt: { type: Date }
  },
  { timestamps: true }
);

AuctionSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('Auction', AuctionSchema);
module.exports.types = types;
module.exports.status = status;
