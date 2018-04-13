/**
 * This file will validate create condition
 */
module.exports = async function (req, res, next) {
    try {
        req.checkBody('title', req.__('タイトルは必須です。')).notEmpty();
        req.checkBody('email', req.__('メールアドレスは必須です。')).notEmpty();
        req.checkBody('email', req.__('メールアドレスを正しいメールアドレスにしてください。')).isEmail();
        req.checkBody('content', req.__('内容を正しいメールアドレスにしてください。')).notEmpty();

        let validationResult = await req.getValidationResult();
        if (validationResult.isEmpty()) {
            return next();
        }
        res.validationErrors(validationResult.array());
    } catch (error) {
        res.serverError({}, error);
    }
};
