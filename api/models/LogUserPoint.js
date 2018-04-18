'use strict';
const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate');

const LogUserPointsSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User'
    },
    point: {
      type: Number
    },
    task: {
      type: Number,
      ref: 'Task'
    },
    from: {
      type: mongoose.Schema.ObjectId,
      ref: 'User'
    },
    deletedAt: {
      type: Date
    }
  },
  {
    timestamps: true
  }
);

LogUserPointsSchema.plugin(mongoosePaginate);
module.exports = mongoose.model('LogUserPoint', LogUserPointsSchema);
