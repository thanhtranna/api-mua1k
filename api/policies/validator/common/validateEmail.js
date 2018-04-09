/**
 * This file will validate email
 */
module.exports = async function(req, res, next) {
  try {
    req.checkBody('email', req.__('email_is_required')).notEmpty();
    req.checkBody('email', req.__('email_malformed')).isEmail();

    let validationResult = await req.getValidationResult();
    if (validationResult.isEmpty()) return next();

    res.validationErrors(validationResult.array());
  } catch (error) {
    res.serverError({}, error);
  }
};
