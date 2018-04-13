/**
 * Created by daulq on 9/18/17.
 */

module.exports = asyncWrap(async (req, res, next) => {
    req.checkBody("content", req.__("内容は必須です。")).notEmpty();
    let checkValidator = await req.getValidationResult();
    if(!checkValidator.isEmpty()) {
        return res.validationErrors(checkValidator.array());
    }
    return next();
})
