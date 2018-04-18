/**
 * UserFavoriteProduct.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate');

const UserFavoriteProductSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    name: {
      type: String
    },
    url: {
      type: String
    }
  },
  {
    timestamps: true
  }
);

UserFavoriteProductSchema.plugin(mongoosePaginate);

module.exports = mongoose.model(
  'UserFavoriteProduct',
  UserFavoriteProductSchema
);
