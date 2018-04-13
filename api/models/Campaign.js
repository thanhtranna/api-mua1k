"use strict";
const mongoose = require("mongoose");
const mongoosePaginate = require('mongoose-paginate');

const status = {
    notActive: 0,
    active: 1
};
const types = {
    webView: 1,
    search: 2
};

const CampaignSchema = new mongoose.Schema({
    content     : {type: String},
    banner      : {type: Object, required: true},
    type        : {type: Number, enum: [1, 2], required: true},
    url         : {type: String},
    status      : {type: Number, enum: [0, 1], default: status.active},
    deletedAt   : {type: Date}
}, { timestamps: true });

CampaignSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('Campaign', CampaignSchema);
module.exports.types = types;
module.exports.status = status;
