/**
 * thienlv: this model store any data for debug
 */

'use strict';
const mongoose = require('mongoose');

const DebugSchema = mongoose.Schema(
  {
    auction: { type: mongoose.Schema.Types.ObjectId },
    finishAt: { type: Date },
    data: {}
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Debug', DebugSchema);
