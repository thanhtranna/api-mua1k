"use strict";

module.exports = {

    /**
     * Return Category info by id
     * @param id - mongodb id
     * @param selectFields
     * @return {Promise}
     */
    findById: function(id, selectFields = 'name icon') {
        if (!id) throw new Error('CategoryRepository - findById required id param');
        return Category
            .findOne({ _id: id, deletedAt: {$exists: false} })
            .select(selectFields)
    },

    getAll: () => {
        return Category
            .find({deletedAt: {$exists: false}})
            .select('name icon')
            .sort({createdAt: -1});
    },

    /**
     * Check if category is exist or not delete
     * @param id
     * @return {Promise.<boolean>}
     */
    isExist: async (id) => {
        if (!id) throw new Error('CategoryRepository - checkExist required id param');
        try {
            let category = await Category.findOne({ _id: id, deletedAt: {$exists: false} });
            return !!category;
        } catch (err) {
            throw err;
        }
    }


};
