/**
 * This file will validate create campaign
 */
module.exports = async function (req, res, next) {
    try {
        req.checkBody('password', req.__('パスワードは必須です。')).notEmpty();
        req.checkBody('password', req.__('パスワードは6文字以上にしてください。')).isLength({min: 6});

        req.checkBody('confirm_password', req.__('パスワードを認証するは必須です。')).notEmpty();

        let validationResult = await req.getValidationResult();
        if (validationResult.isEmpty()) return next();

        res.validationErrors(validationResult.array());
    } catch (error) {
        res.serverError({}, error);
    }
};
