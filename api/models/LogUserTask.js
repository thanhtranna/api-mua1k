/**
 * LogUserTask.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

const LogUserTaskSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    value: {
        type: Number
    },
    task: {
        type: Number
    }
}, {
    timestamps: true
});

module.exports = mongoose.model("LogUserTask", LogUserTaskSchema);
