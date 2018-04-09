/**
 * UserCoin.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

const mongoose = require("mongoose");
const UserCoinSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    coin: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});
module.exports = mongoose.model("UserCoin", UserCoinSchema);

