"use strict";

module.exports = asyncWrap(async (req, res, next) => {
    let categoryId = '';
    if (req.body !== undefined) {
        categoryId = req.body.category;
    } else {
        categoryId  = req.query.category;
    }

    const tmp = categoryId.split(",");
    tmp.map(function ( cat, index) {
        if (!sails.helpers.isMongoId(cat))
            return res.badRequest(sails.errors.idMalformed);
    });

    next();
});
