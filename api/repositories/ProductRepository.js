"use strict";

const ProductRepository = {

    findByCategory: async (categoryId, selectFields = 'id name images category') => {
        try {
            if(sails.helpers.isMongoId(categoryId)) {
                let category = await Category.findOne({_id:sails.helpers.toObjectId(categoryId)});
                if(category) {
                    sails.log(await Product
                        .find({
                            "category.*": categoryId,
                            deletedAt: {$exists: false}
                        })
                        .select(selectFields)
                        .lean());
                    return await Product
                        .find({
                            category: sails.helpers.toObjectId(categoryId),
                            deletedAt: {$exists: false}
                        })
                        .select(selectFields)
                        .lean();
                } else {
                    return await Product
                        .find({
                            deletedAt: {$exists: false}
                        })
                        .select(selectFields)
                        .lean();
                }

            } else {
                return await Product
                    .find({
                        deletedAt: {$exists: false}
                    })
                    .select(selectFields)
                    .lean();
            }

        } catch (error) {
            throw error;
        }
    },

    findByCategories: async (selectFields = 'id name images') => {
        try {
            let products = await Product
                .find({
                    deletedAt: {$exists: false}
                })
                .select(selectFields)
                .lean();
            return products;
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
    getArrayIdByCategory: async (categoryId, selectFields = 'id name description') => {
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



    getArrayIdByCategories: async (selectFields = '_id') => {
        try {
            let products = await ProductRepository.findByCategories(selectFields);
            let data = sails.helpers.arrayObjectToArrayValue(products);
            return data;
        } catch (error) {
            throw error;
        }
    }
};

module.exports = ProductRepository;
