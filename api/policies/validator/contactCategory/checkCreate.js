module.exports = async function (req, res, next) {
    try {
        req.checkBody('name', req.__('タイトルは必須です。')).notEmpty();

        let validationResult = await req.getValidationResult();
        if (validationResult.isEmpty()) return next();

        res.validationErrors(validationResult.array());
    } catch (error) {
        res.serverError({}, error);
    }
};
