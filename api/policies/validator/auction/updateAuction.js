/**
 * This file will validate update auction
 */
module.exports = async function(req, res, next) {
  try {
    req.checkBody('product', req.__('product_is_required')).notEmpty();

    if (req.body.startAt) {
      req.checkBody('startAt', req.__('startAt_must_type_date')).isDate();
      req
        .checkBody('startAt', req.__('startAt_must_after_current_date'))
        .isAfter();
    }

    if (req.body.expiredAt) {
      req.checkBody('expiredAt', req.__('expiredAt_must_type_date')).isDate();
      req
        .checkBody('expiredAt', req.__('expiredAt_must_after_startAt'))
        .isAfter(req.body.startAt);
    }

    if (req.body.finishAt) {
      req.checkBody('finishAt', req.__('finishAt_must_type_date')).isDate();
      req
        .checkBody(
          'finishAt',
          req.__('finishAt_must_into_limit_startAt_expiredAt')
        )
        .isAfter(req.body.startAt)
        .isBefore(req.body.expiredAt);
    }

    if (req.body.status) {
      req
        .checkBody('status', req.__('status_must_integer_number'))
        .isAlphanumeric();
    }

    if (req.body.chanceNumber) {
      req
        .checkBody('chanceNumber', req.__('chanceNumber_must_integer_number'))
        .isAlphanumeric();
    }

    if (req.body.luckyNumber) {
      req
        .checkBody('luckyNumber', req.__('luckyNumber_must_integer_number'))
        .isAlphanumeric();
    }

    let validationResult = await req.getValidationResult();
    if (validationResult.isEmpty()) return next();

    res.validationErrors(validationResult.array());
  } catch (error) {
    res.serverError({}, error);
  }
};
