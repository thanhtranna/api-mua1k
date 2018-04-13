"use strict";

module.exports = asyncWrap(async (req, res, next) => {
    let categoryId = req.params.categoryid;

    if (!sails.helpers.isMongoId(categoryId))
        return res.badRequest(sails.errors.idMalformed);

    if (! await Category.count({ _id: categoryId, deletedAt: {$exists: false} }) )
        return res.badRequest(sails.errors.categoryNotFound);

    next();
});
