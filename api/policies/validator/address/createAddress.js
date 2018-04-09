/**
 * Created by thanhtv on 4/10/18.
 */

module.exports = asyncWrap(async (req, res, next) => {
  req.checkBody('address', req.__('address_is_required')).notEmpty();
  req.checkBody('fullname', req.__('fullname_is_required')).notEmpty();
  req.checkBody('phone', req.__('phone_is_required')).notEmpty();
  req
    .checkBody('phone', req.__('phone_is_not_format'))
    .isLength({ min: 8, max: 15 });
  req.checkBody('postcode', req.__('postcode_is_required')).notEmpty();
  req.checkBody('postcode', req.__('postcode_is_numeric')).isNumeric();
  req.checkBody('province', req.__('province_is_required')).notEmpty();
  req.checkBody('district', req.__('district_is_required')).notEmpty();
  req.checkBody('town', req.__('town_is_required')).notEmpty();
  let checkValidations = await req.getValidationResult();
  if (!checkValidations.isEmpty())
    return res.validationErrors(checkValidations.array());
  return next();
});
