/**
 * Created by daulq on 9/12/17.
 */

module.exports = asyncWrap(async (req, res, next) => {
    req.checkQuery("postcode", req.__("postcode_is_required")).notEmpty();
    let checkQuery = await req.getValidationResult();
    if(!checkQuery.isEmpty()) return res.validationErrors(checkQuery.array());
    return next();
})