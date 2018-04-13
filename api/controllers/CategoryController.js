/**
 * CategoryController
 *
 * @description :: Server-side logic for managing Categories
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

    /**
     * Get All Categories
     * @return {json}
     */
    getCategories: asyncWrap(async (req, res) => {
        let categories = await CategoryRepository.getAll();

        res.ok({data: categories});
    })

};
