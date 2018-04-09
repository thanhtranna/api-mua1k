"use strict";
const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate');

const ProductSchema = new mongoose.Schema({
    name             : { type: String,  max: 255, required: true },
    description      : { type: String },
    value            : { type: Number },
    chanceNumber     : { type: Number },
    quantity         : { type: Number },
    images           : { type: Object},
    featureImage     : { type: Object},
    price            : { type: Number },
    isFavorite       : { type: Boolean,  defaultsTo: false},
    expDateNumber    : { type: Number },
    category         : { type: mongoose.Schema.ObjectId, ref: 'Category' },
    condition        : { type: mongoose.Schema.ObjectId, ref: 'Condition' },
    deletedAt        : { type: Date },
}, { timestamps: true });

ProductSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('Product', ProductSchema);
