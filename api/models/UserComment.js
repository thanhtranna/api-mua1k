/**
 * UserComment.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate");

const status = {
    block: 0,
    approved: 1,
    waiting: 2
};

const UserCommentSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    review: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Review",
    },
    content: {
        type: String,
        required: true
    },
    status: {
        type: Number,
        default: status.waiting,
        enum: [0, 1, 2]
    },
    deletedAt: {
        type: Date
    }
}, {
    timestamps: true
});

UserCommentSchema.plugin(mongoosePaginate);
module.exports = mongoose.model("UserComment", UserCommentSchema);
module.exports.status = status;
