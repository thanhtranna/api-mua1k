/**
 * This file will validate email
 */
module.exports = async function (req, res, next) {
  try {
    req.checkBody('email', req.__('メールアドレスは必須です。')).notEmpty();
    req.checkBody('email', req.__('メールアドレスを正しいメールアドレスにしてください。')).isEmail();

    let validationResult = await req.getValidationResult();
    if ( validationResult.isEmpty() ) return next();

    res.validationErrors(validationResult.array());
  } catch (error) {
    res.serverError({}, error);
  }
};
