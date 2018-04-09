'use strict';
const mongoose = require('mongoose');
const ConditionSchema = new mongoose.Schema(
  {
    name: {
      type: String
    },
    value: {
      type: Number
    },
    deletedAt: {
      type: Date
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Condition', ConditionSchema);
