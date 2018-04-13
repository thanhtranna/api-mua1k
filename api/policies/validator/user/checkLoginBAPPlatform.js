
module.exports = asyncWrap(async (req, res, next) => {
    req.checkBody("accessToken", req.__("access_token_is_required")).notEmpty();
    req.checkBody("deviceToken", req.__("device_token_is_required")).notEmpty();
    let checkBody = await req.getValidationResult();
    if(!checkBody.isEmpty()) return res.validationErrors(checkBody.array());
    return next();
})
