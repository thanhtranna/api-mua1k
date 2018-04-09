'use strict';
const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate');

const AdminSchema = new mongoose.Schema(
  {
    email: { type: String, min: 5, max: 255 },
    password: { type: String, max: 255 },
    nickname: { type: String, max: 255 },
    gender: { type: Number, enum: [0, 1] },
    deletedAt: { type: Date }
  },
  { timestamps: true }
);

AdminSchema.plugin(mongoosePaginate);

// Before create new Admin, let hash user password
AdminSchema.pre('save', async function save(next) {
  try {
    const user = this;

    // hash password
    if (user.password) user.password = await BcryptService.hash(user.password);

    next();
  } catch (error) {
    next(error);
  }
});

module.exports = mongoose.model('Admin', AdminSchema);
