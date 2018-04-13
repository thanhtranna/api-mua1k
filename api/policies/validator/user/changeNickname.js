/**
 * Created by daulq on 9/12/17.
 */

module.exports = asyncWrap(async (req, res, next) => {
    req.checkBody("nickname", req.__("ニックネームは必須です。")).notEmpty();
    let validationResult = await req.getValidationResult();
    if (!validationResult.isEmpty()) return res.validationErrors(validationResult.array());
    return next();
})
