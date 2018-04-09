/**
 * Created by thanhtv on 4/10/18.
 */

module.exports = asyncWrap(async (req, res, next) => {
  req.checkBody('point', req.__('point_is_required')).notEmpty();
  const checkValidations = await req.getValidationResult();
  if (!checkValidations.isEmpty())
    return res.validationError(checkValidations.array());
  return next();
});
