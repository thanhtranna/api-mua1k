"use strict";
const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate');

const LogReturnCoinSchema = new mongoose.Schema(
    {
        user        : {
            type: mongoose.Schema.ObjectId,
            ref: 'User'
        },
        coin        : {
            type: Number
        },
        status      : {
            type: Number
        },
    },
    {
        timestamps: true
    }
);

LogReturnCoinSchema.plugin(mongoosePaginate);
module.exports = mongoose.model('LogReturnCoin', LogReturnCoinSchema);
