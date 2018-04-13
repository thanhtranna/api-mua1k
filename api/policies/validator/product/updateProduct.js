/**
 * This file will validate create product
 */
module.exports = async function (req, res, next) {
    try {
        if (req.body.name)
            req.checkBody('name', req.__('タイトルは:max文字以下にしてください。')).isLength({max: 255});
        if (req.body.value)
            req.checkBody('value', req.__('割引値は数字にしてください。')).isFloat();
        if (req.body.quantity)
            req.checkBody('quantity', req.__('量は整数にしてください。')).isAlphanumeric();
        if (req.body.price)
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
