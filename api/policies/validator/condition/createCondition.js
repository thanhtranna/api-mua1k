/**
 * This file will validate create condition
 */
module.exports = async function (req, res, next) {
    try {
        req.checkBody('name', req.__('タイトルは必須です。')).notEmpty();
        req.checkBody('value', req.__('値は必須です。')).notEmpty();
        req.checkBody("value", req.__("値は数字にしてください。")).isNumeric();
        let validationResult = await req.getValidationResult();
        if (validationResult.isEmpty()) {
            return next();
        }
        res.validationErrors(validationResult.array());
    } catch (error) {
        res.serverError({}, error);
    }
};
