"use strict";

module.exports = asyncWrap(async (req, res, next) => {
    req.checkBody('content', req.__('内容は必須です。')).notEmpty();

    let validationResult = await req.getValidationResult();
    if (!validationResult.isEmpty()) return res.validationErrors(validationResult.array());

    next();
});
