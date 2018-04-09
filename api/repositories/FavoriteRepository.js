/**
 * Created by daulq on 9/18/17.
 */
const fieldFavorite = "_id name url";
module.exports = {

    /**
     * Function favoriteList.
     * @description Get favorite product of user
     * @param {ObjectId()} user
     * @returns {Promise.<void>}
     */

    favoriteList: async (user) => {
        try {
            return UserFavoriteProduct.find({user}).select(fieldFavorite);
        } catch(error) {
            throw error;
        }

    },

    /**
     * Function create.
     * @description Create new favorite product.
     * @param {object} params
     *   {ObjectId()} user id of user
     *   {String} name name of product
     *   {string} url url of product
     * @returns {Promise.<object>|favorite}
     */

    create: async(params) => {
        try {
            let favorite = await UserFavoriteProduct.create(params);
            favorite = await UserFavoriteProduct.findById(favorite._id).select(fieldFavorite);
            return favorite;
        } catch(error) {
            throw error;
        }
    }
}