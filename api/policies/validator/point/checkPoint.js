/**
 * Created by daulq on 9/13/17.
 */

module.exports = asyncWrap(async (req, res, next) => {
    req.checkBody("point", req.__("point_is_required")).notEmpty();
    let checkValidations = await req.getValidationResult();
    if(!checkValidations.isEmpty()) return res.validationError(checkValidations.array());
    return next();
})