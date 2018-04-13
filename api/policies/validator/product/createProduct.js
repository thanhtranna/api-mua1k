/**
 * This file will validate create product
 */
module.exports = async function (req, res, next) {
    try {
        req.checkBody('name', req.__('タイトルは必須です。')).notEmpty();
        req.checkBody('name', req.__('タイトルは255文字以下にしてください。')).isLength({max: 255});
        req.checkBody('description', req.__('説明は必須です。')).notEmpty();

        if (req.body.value)
            req.checkBody('value', req.__('割引値は数字にしてください。')).isFloat();

        if (req.body.quantity) {
            req.checkBody('quantity', req.__('量は必須です。')).notEmpty();
            req.checkBody('quantity', req.__('量は整数にしてください。')).isAlphanumeric();
        }
            req.checkBody('price', req.__('価格は必須です。')).notEmpty();
            req.checkBody('price', req.__('価格は数字にしてください。')).isFloat();

        if (req.body.expDateNumber)
        req.checkBody('expDateNumber', req.__('終了時日は整数にしてください。')).isAlphanumeric();

        let validationResult = await req.getValidationResult();
        if (validationResult.isEmpty()) return next();

        res.validationErrors(validationResult.array());
    } catch (error) {
        res.serverError({}, error);
    }
};
