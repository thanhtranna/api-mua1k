/**
 * This file will validate create product
 */
module.exports = async function(req, res, next) {
  try {
    req.checkBody('name', req.__('name_is_required')).notEmpty();
    req.checkBody('name', req.__('name_is_max_length')).isLength({ max: 255 });
    req.checkBody('description', req.__('description_is_required')).notEmpty();

    if (req.body.value)
      req.checkBody('value', req.__('value_is_must_number')).isFloat();

    req.checkBody('quantity', req.__('quantity_is_required')).notEmpty();
    req
      .checkBody('quantity', req.__('quantity_must_integer_number'))
      .isAlphanumeric();
    req.checkBody('price', req.__('price_is_required')).notEmpty();
    req.checkBody('price', req.__('price_is_must_number')).isFloat();

    if (req.body.expDateNumber)
      req
        .checkBody('expDateNumber', req.__('expDateNumber_must_integer_number'))
        .isAlphanumeric();

    const validationResult = await req.getValidationResult();
    if (validationResult.isEmpty()) return next();

    res.validationErrors(validationResult.array());
  } catch (error) {
    res.serverError({}, error);
  }
};
