/**
 * UserPoint.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

const friend = {
  best: 500,
  good: 300,
  normal: 100
};

const UserPointSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    point: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true
  }
);
module.exports = mongoose.model('UserPoint', UserPointSchema);
module.exports.friend = friend;
