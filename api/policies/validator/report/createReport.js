/**
 * This file will validate create message
 */
module.exports = async function (req, res, next) {
    try {
        req.checkBody('content', req.__('内容は必須です。')).notEmpty();
        req.checkBody('userid', req.__('ユーザーは必須です。')).notEmpty();

        let validationResult = await req.getValidationResult();
        if (validationResult.isEmpty()) {
            return next();
        }
        res.validationErrors(validationResult.array());
    } catch (error) {
        res.serverError({}, error);
    }
};
