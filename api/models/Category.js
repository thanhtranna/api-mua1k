'use strict';
const mongoose = require('mongoose');

const CategorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    icon: { type: Object, required: true },
    deletedAt: { type: Date }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Category', CategorySchema);
