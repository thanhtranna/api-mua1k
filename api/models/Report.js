"use strict";
const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate');

const ReportSchema = new mongoose.Schema({
    toUser        : { type: mongoose.Schema.ObjectId, required: true, ref: 'User' },
    fromUser      : { type: mongoose.Schema.ObjectId, required: true, ref: 'User' },
    content       : { type: String },
    isHandle      : { type: Boolean, default: false },
}, { timestamps: true });

ReportSchema.plugin(mongoosePaginate);
module.exports = mongoose.model('Report', ReportSchema);
