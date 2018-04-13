module.exports = asyncWrap(async (req, res, next) => {
    try {
        let id = req.param('category');
        let isId = sails.helpers.isMongoId(id);
        if (isId) {
            let cate = MessageCategory.count({_id: id});
            if (cate) {
                return next();
            }
        }
        return res.badRequest({message: 'Category not found'});
    } catch (error) {
        res.serverError({}, error);
    }
})
