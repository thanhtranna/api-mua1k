'use strict';
const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate');

const UserChanceBuySchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.ObjectId, ref: 'User' },
    auction: { type: mongoose.Schema.ObjectId, ref: 'Auction' },
    number: { type: Number },
    ip: { type: String }
  },
  { timestamps: true }
);
UserChanceBuySchema.plugin(mongoosePaginate);

module.exports = mongoose.model('UserChanceBuy', UserChanceBuySchema);
