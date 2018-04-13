/**
 * This file will validate create campaign
 */
module.exports = async function (req, res, next) {
    try {
        req.checkBody('content', req.__('内容は必須です。')).notEmpty();
        req.checkBody('type', req.__('タイプは必須です。')).notEmpty();
        req.checkBody('type', req.__('タイプは整数にしてください。')).isAlphanumeric();
        req.checkBody('status', req.__('状態は必須です。')).notEmpty();
        req.checkBody('status', req.__('状態は整数にしてください。')).isAlphanumeric();
        req.checkBody('url', req.__('urlは必須です。')).notEmpty();
        req.checkBody('url', req.__('urlは255文字以下にしてください。')).isLength({max: 255});

        let validationResult = await req.getValidationResult();
        if (validationResult.isEmpty()) return next();

        res.validationErrors(validationResult.array());
    } catch (error) {
        res.serverError({}, error);
    }
};
