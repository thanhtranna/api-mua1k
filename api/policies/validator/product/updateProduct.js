/**
 * This file will validate create product
 */
module.exports = async function(req, res, next) {
  try {
    if (req.body.name)
      req
        .checkBody('name', req.__('name_is_max_length'))
        .isLength({ max: 255 });
    if (req.body.value)
      req.checkBody('value', req.__('value_is_must_number')).isFloat();
    if (req.body.quantity)
      req
        .checkBody('quantity', req.__('quantity_must_integer_number'))
        .isAlphanumeric();
    if (req.body.price)
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
