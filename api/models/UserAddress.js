

'use strict'
const mongoose = require('mongoose');

const UserAddressSchema = new mongoose.Schema({
    user : { type: mongoose.Schema.ObjectId, ref: 'User' },
    address : { type : String},
    fullname : { type : String},
    phone: {type: String},
    postcode : { type : String},
    province : { type : String},
    district : { type : String},
    town : { type : String},
    street : { type : String},
    note : { type : String},
    deletedAt : { type : Date},
    isDefault: {type: Boolean, default: false}
}, { timestamps: true });

module.exports = mongoose.model('UserAddress', UserAddressSchema);

