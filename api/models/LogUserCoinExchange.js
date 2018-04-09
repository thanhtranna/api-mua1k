"use strict";
const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate');

const LogUserCoinExchangesSchema = new mongoose.Schema(
    {
        user        : {
            type: mongoose.Schema.ObjectId,
            ref: 'User'
        },
        point       : {
            type: Number
        },
        coin        : {
            type: Number
        },
        code        : {
            type: String
        },
        status      : {
            type: Number
        },
        deletedAt   : {
            type: Date
        }
    },
    {
        timestamps: true
    }
);

LogUserCoinExchangesSchema.plugin(mongoosePaginate);
module.exports = mongoose.model('LogUserCoinExchange', LogUserCoinExchangesSchema);
