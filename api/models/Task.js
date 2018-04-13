"use strict";
const mongoose = require('mongoose');

const TasksSchema = new mongoose.Schema({
    name                : { type: String },
    point               : { type: Number },
    value               : { type: Number },
    startDay            : { type: Date },
    stopDay             : { type: Date },
    deletedAt           : { type: Date }
}, { timestamps: true });

TasksSchema.plugin(autoIncrement.plugin, 'Task');
module.exports = mongoose.model('Task', TasksSchema);
