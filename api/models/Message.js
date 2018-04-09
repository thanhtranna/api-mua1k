"use strict";
const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate');

const MessageSchema = new mongoose.Schema({
    title             : { type: String },
    description       : { type: String },
    category          : {type : mongoose.Schema.ObjectId, ref: 'MessageCategory'},
    status            : {type : Boolean, default: true},
    deletedAt         : {type : Date}
}, { timestamps: true });

MessageSchema.plugin(mongoosePaginate);
module.exports = mongoose.model('Message', MessageSchema);
