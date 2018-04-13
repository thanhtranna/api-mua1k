/**
 * This file will validate create campaign
 */
module.exports = async function (req, res, next) {
    try {
        req.checkBody('email', req.__('メールアドレスは必須です。')).notEmpty();
        req.checkBody('email', req.__('メールアドレスを正しいメールアドレスにしてください。')).isEmail();
        req.checkBody('password', req.__('パスワードは必須です。')).notEmpty();
        req.checkBody('password', req.__('パスワードは6文字以上にしてください。')).isLength({min: 6});
        req.checkBody('nickname', req.__('ニックネームは必須です。')).notEmpty();
        req.checkBody('gender', req.__('性別は必須です。')).notEmpty();
        req.checkBody('confirm_password', req.__('パスワードを認証するは必須です。')).notEmpty();

        let validationResult = await req.getValidationResult();
        if (validationResult.isEmpty()) return next();

        res.validationErrors(validationResult.array());
    } catch (error) {
        res.serverError({}, error);
    }
};
