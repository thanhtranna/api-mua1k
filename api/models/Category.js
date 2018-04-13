"use strict";
const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate');

const CategorySchema = new mongoose.Schema({
    name         : { type: String,  required: true },
    icon         : { type: Object,  required: true },
    deletedAt    : { type: Date }
}, { timestamps: true });

CategorySchema.plugin(mongoosePaginate);
module.exports = mongoose.model('Category', CategorySchema);
