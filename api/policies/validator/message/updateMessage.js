module.exports = async function (req, res, next) {
    try {

        if (req.param('category')) {
            let categoryId = req.param('category');
            let isIdMongo = sails.helpers.isMongoId(categoryId);
            if (isIdMongo) {
                let category = await MessageCategory.count({_id : categoryId});
                if (category) {
                    return next();
                }
            }
            return res.badRequest({message: 'Category not found'});
        }
        return next();
    } catch (error) {
        res.serverError({}, error);
    }
};
