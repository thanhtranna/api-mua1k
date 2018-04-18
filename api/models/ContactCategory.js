'use strict';
const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate');

const ContactCategorySchema = mongoose.Schema(
  {
    name: { type: String },
    deletedAt: { type: Date }
  },
  { timestamps: true }
);

ContactCategorySchema.plugin(mongoosePaginate);
module.exports = mongoose.model('ContactCategory', ContactCategorySchema);
