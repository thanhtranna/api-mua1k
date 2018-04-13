/**
 * This file will validate create auction
 */
module.exports = async function (req, res, next) {
    try {
        req.checkBody('product', req.__('製品は必須です。')).notEmpty();
        req.checkBody('startAt', req.__('開始時日は必須です。')).notEmpty();
        req.checkBody('startAt', req.__('開始時日は書式と一致していません。')).isDate();
        // req.checkBody('startAt', req.__('開始時日は正しい日付ではありません。')).isAfter();

        let validationResult = await req.getValidationResult();
        if (validationResult.isEmpty()) return next();

        res.validationErrors(validationResult.array());
    } catch (error) {
        res.serverError({}, error);
    }
};
