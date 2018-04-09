"use strict";
const mongoose = require('mongoose');

const MessageCategorySchema = new mongoose.Schema({
    name              : { type: String },
    icon              : { type: Object },
    deletedAt         : {type : Date}
}, { timestamps: true });

module.exports = mongoose.model('MessageCategory', MessageCategorySchema);
