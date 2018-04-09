/**
 * This file will validate create campaign
 */
module.exports = async function(req, res, next) {
  try {
    req.checkBody('content', req.__('content_is_required')).notEmpty();
    req.checkBody('type', req.__('type_is_required')).notEmpty();
    req.checkBody('type', req.__('type_must_integer_number')).isAlphanumeric();
    req.checkBody('status', req.__('status_is_required')).notEmpty();
    req
      .checkBody('status', req.__('status_must_integer_number'))
      .isAlphanumeric();
    req.checkBody('url', req.__('url_is_required')).notEmpty();
    req.checkBody('url', req.__('url_is_max_length')).isLength({ max: 255 });

    let validationResult = await req.getValidationResult();
    if (validationResult.isEmpty()) return next();

    res.validationErrors(validationResult.array());
  } catch (error) {
    res.serverError({}, error);
  }
};
