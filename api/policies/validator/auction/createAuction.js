/**
 * This file will validate create auction
 */
module.exports = async function(req, res, next) {
  try {
    req.checkBody('product', req.__('product_is_required')).notEmpty();
    req
      .checkBody('isImmediateBuy', req.__('isImmediateBuy_is_required'))
      .notEmpty();
    req.checkBody('isSuggest', req.__('isSuggest_is_required')).notEmpty();
    req.checkBody('startAt', req.__('startAt_is_required')).notEmpty();
    req.checkBody('startAt', req.__('startAt_must_type_date')).isDate();
    // req.checkBody('startAt', req.__('startAt_must_after_current_date')).isAfter();
    req.checkBody('expiredAt', req.__('expiredAt_is_required')).notEmpty();
    req.checkBody('expiredAt', req.__('expiredAt_must_type_date')).isDate();
    req
      .checkBody('expiredAt', req.__('expiredAt_must_after_startAt'))
      .isAfter(req.body.startAt);
    req.checkBody('finishAt', req.__('finishAt_is_required')).notEmpty();
    req.checkBody('finishAt', req.__('finishAt_must_type_date')).isDate();
    // req.checkBody('finishAt', req.__('finishAt_must_into_limit_startAt_expiredAt')).isAfter(req.body.startAt).isBefore(req.body.expiredAt);

    let validationResult = await req.getValidationResult();
    if (validationResult.isEmpty()) return next();

    res.validationErrors(validationResult.array());
  } catch (error) {
    res.serverError({}, error);
  }
};
