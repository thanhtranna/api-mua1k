"use strict";
const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate');

const LogUserCoinCharge = new mongoose.Schema(
    {
        user : {
            type: mongoose.Schema.ObjectId,
            ref: 'User'
        },
        coin : {
            type: Number
        },
        money : {
            type: Number
        },
        code : {
            type: String
        },
        deletedAt: {
            type: Date
        }
    },
    {
        timestamps: true
    }
);

LogUserCoinCharge.plugin(mongoosePaginate);
module.exports = mongoose.model('LogUserCoinCharge', LogUserCoinCharge);
