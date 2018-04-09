/**
 * UserFavoriteProduct.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

const UserFavoriteProductSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    name: {
        type:String
    },
    url: {
        type: String
    }
}, {
    timestamps: true
});

module.exports = mongoose.model("UserFavoriteProduct", UserFavoriteProductSchema);

