"use strict";

const ProductRepository = {

    findByCategory: async (categoryId, selectFields = 'id name images') => {
        try {
            return await Product
                .find({
                    category: categoryId,
                    deletedAt: {$exists: false}
                })
                .select(selectFields)
                .lean();
        } catch (error) {
            throw error;
        }
    },

    /**
     * Get all product of a category and return array id
     * @param categoryId
     * @param selectFields
     * @return {array}
     */
    getArrayIdByCategory: async (categoryId, selectFields = 'id') => {
        try {
            let products = await ProductRepository.findByCategory(categoryId, selectFields);
            return sails.helpers.arrayObjectToArrayValue(products);
        } catch (error) {
            throw error;
        }
    },

    findProduct: async (productId, selectFields) => {
        try {
            return await Product
                .findOne({_id: productId})
                .select(selectFields);
        } catch (err) {
            throw err;
        }
    },

    /**
     * Find product by keyword
     * @param keyword
     * @return {Promise.<{}>}
     */
    findByKeyword: async (keyword) => {
        try {
            return await Product
                .find({ name: new RegExp(keyword, 'i') })
                .select('_id name');
        }
        catch (error) {
            throw error;
        }
    },

    /**
     * Get all product by keyword and return array id
     * @param {string} keyword
     * @return {Promise.<>}
     */
    getArrayIdByKeyword: async (keyword) => {
        try {
            let products = await ProductRepository.findByKeyword(keyword);
            // TODO: debug why can't use helper
            let arrayId = [];
            products.forEach(product => {
                arrayId.push(product._id)
            });
            return arrayId;
        }
        catch (error) {
            throw error;
        }
    },

};

module.exports = ProductRepository;
