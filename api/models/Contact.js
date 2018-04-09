/**
 * Contact.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

const ContactSchema = mongoose.Schema(
  {
    contactCategory: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ContactCategory'
    },
    email: {
      type: String
    },
    content: {
      type: String
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Contact', ContactSchema);
