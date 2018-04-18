'use strict';
const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate');

const LogSubtractCoinSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User'
    },
    coin: {
      type: Number
    },
    status: {
      type: Number
    }
  },
  {
    timestamps: true
  }
);

LogSubtractCoinSchema.plugin(mongoosePaginate);
module.exports = mongoose.model('LogSubtractCoin', LogSubtractCoinSchema);
