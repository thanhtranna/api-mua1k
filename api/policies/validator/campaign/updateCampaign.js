/**
 * This file will validate create campaign
 */
module.exports = async function (req, res, next) {
    try {
        if (req.body.type)
            req.checkBody('type', req.__('タイプは整数にしてください。')).isAlphanumeric();
        if (req.body.status)
            req.checkBody('status', req.__('状態は整数にしてください。')).isAlphanumeric();
        if (req.body.url)
            req.checkBody('url', req.__('Urlは255文字以下にしてください。')).isLength({max: 255});

        let validationResult = await req.getValidationResult();
        if (validationResult.isEmpty()) return next();

        res.validationErrors(validationResult.array());
    } catch (error) {
        res.serverError({}, error);
    }
};
