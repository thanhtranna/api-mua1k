"use strict";
const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate');
const ConditionSchema = new mongoose.Schema(
    {
        name: {
            type: String
        },
        value: {
            type: Number
        },
        deletedAt: {
            type: Date
        }
    },
    {
        timestamps: true
    }
);
ConditionSchema.plugin(mongoosePaginate);
module.exports = mongoose.model('Condition', ConditionSchema);
