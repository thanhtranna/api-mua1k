'use strict';
const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate');

const status = {
  block: 0,
  approved: 1,
  waiting: 2
};

const ReviewsSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User'
    },
    auction: {
      type: mongoose.Schema.ObjectId,
      ref: 'Auction'
    },
    content: {
      type: String
    },
    image: {
      type: Object
    },
    status: {
      type: Number,
      default: status.waiting,
      enum: [0, 1, 2]
    },
    deletedAt: {
      type: Date
    }
  },
  {
    timestamps: true
  }
);

ReviewsSchema.plugin(mongoosePaginate);
module.exports = mongoose.model('Review', ReviewsSchema);
module.exports.status = status;
