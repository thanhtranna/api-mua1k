"use strict";
const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate');

const socials = {
    facebook: 'facebook',
    twitter: 'twitter',
    line: 'line',
    bap: 'bap'
};

const UserSchema = new mongoose.Schema({
    uid                 : { type: Number, unique: true },
    email               : { type: String, min: 5, max: 255 },
    password            : { type: String, max: 255 },
    nickname            : { type: String, max: 255 },
    avatar              : { type: Object },
    gender              : { type: Number, enum: [0, 1] },
    verifyCode          : { type: String, max: 32 },
    isVerified          : { type: Boolean, default: false },
    isBlocked           : { type: Boolean, default: false },
    invitationUserId    : { type: Number },
    socialId            : { type: String},
    socialType          : { type: String },
    ip                  : { type: String },
    device              : { type: String },
    address             : { type: mongoose.Schema.ObjectId, ref: 'UserAddress' },
    deviceToken         : { type: String },
    accessToken         : { type: String },
    deletedAt           : { type: Date },
}, { timestamps: true });

UserSchema.plugin(mongoosePaginate);

// Before create new User, let generate uid and hash user password
UserSchema.pre('save', async function save (next) {
    try {
        const user = this;
        // generate uid
        let lastUserUid = await User.count();
        user.uid = lastUserUid + sails.config.startUserId;

        // hash password
        if (user.password)
            user.password = await BcryptService.hash(user.password);

        next();
    } catch (error) {
        next(error)
    }
});

module.exports = mongoose.model('User', UserSchema);
module.exports.socials = socials;
