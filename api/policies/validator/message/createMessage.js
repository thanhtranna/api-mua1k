/**
 * This file will validate create message
 */
module.exports = async function (req, res, next) {
    try {
        req.checkBody('title', req.__('タイトルは必須です。')).notEmpty();
        req.checkBody('description', req.__('説明は必須です。')).notEmpty();
        req.checkBody('category', req.__('価格は必須です。')).notEmpty();

        let validationResult = await req.getValidationResult();
        if (validationResult.isEmpty()) {
            return next();
        }
        res.validationErrors(validationResult.array());
    } catch (error) {
        res.serverError({}, error);
    }
};
