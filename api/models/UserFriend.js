/**
 * UserFriend.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

const UserFriendSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    friends: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User'
        },
        status: {
          type: Number,
          enum: [1, 2, 3]
        }
      }
    ],
    totalFriend: {
      type: Number,
      default: 0
    },
    totalBestFriend: {
      type: Number,
      default: 0
    },
    totalGoodFriend: {
      type: Number,
      default: 0
    },
    totalNormalFriend: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('UserFriend', UserFriendSchema);
