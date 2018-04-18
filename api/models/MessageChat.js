/**
 * MessageChat.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

const mongoosePagination = require('mongoose-paginate');

const MessageChatSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    message: {
      type: String
    },
    type: {
      type: Number,
      default: 1
    }
  },
  {
    timestamps: true
  }
);

MessageChatSchema.plugin(mongoosePagination);
module.exports = mongoose.model('MessageChat', MessageChatSchema);
