/**
 * LogUserChanceBuy.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate');

let LogUserChanceBuySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      index: true,
      ref: 'User'
    },
    auction: {
      type: mongoose.Schema.Types.ObjectId,
      index: true,
      ref: 'Auction'
    },
    luckyNumber: {
      type: String
    },
    userChanceBuy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'UserChanceBuy'
    }
    // isWinner: {
    //     type: Boolean,
    //     default: false
    // }
  },
  {
    timestamp: true
  }
);
LogUserChanceBuySchema.plugin(mongoosePaginate);

module.exports = mongoose.model('LogUserChanceBuy', LogUserChanceBuySchema);
