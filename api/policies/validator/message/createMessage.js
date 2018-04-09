/**
 * This file will validate create message
 */
module.exports = async function(req, res, next) {
  try {
    req.checkBody('title', req.__('title_is_required')).notEmpty();
    req.checkBody('description', req.__('description_is_required')).notEmpty();
    req.checkBody('category', req.__('category_is_required')).notEmpty();

    const validationResult = await req.getValidationResult();
    if (validationResult.isEmpty()) {
      return next();
    }
    res.validationErrors(validationResult.array());
  } catch (error) {
    res.serverError({}, error);
  }
};
