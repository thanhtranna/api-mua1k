/**
 * Contact.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

const mongoosePaginate = require('mongoose-paginate');

const ContactSchema = mongoose.Schema(
  {
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ContactCategory'
    },
    email: { type: String },
    content: { type: String },
    deletedAt: { type: Date },
    isHandle: { type: Boolean, default: false }
  },
  {
    timestamps: true
  }
);

ContactSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('Contact', ContactSchema);
