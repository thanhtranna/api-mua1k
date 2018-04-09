/**
 * Created by daulq on 9/18/17.
 */

module.exports = asyncWrap(async (req, res, next) => {
  req.checkBody('content', req.__('content_is_required')).notEmpty();
  let checkValidator = await req.getValidationResult();
  if (!checkValidator.isEmpty()) {
    return res.validationErrors(checkValidator.array());
  }
  return next();
});
