/**
 * Created by daulq on 9/25/17.
 */

module.exports = asyncWrap(async (req, res, next) => {
    req.checkBody("message", req.__("message_is_required")).notEmpty();
    let checkValidations = await req.getValidationResult();
    if(!checkValidations.isEmpty()) {
        return res.validationErrors(checkValidations.array());
    }
    return next();
});