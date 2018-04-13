/**
 * This file will validate password
 */
module.exports = function (req, res, next) {
  req.checkBody('password', req.__('パスワードは必須です。')).notEmpty();
  req.checkBody('password', req.__('パスワードは:min文字以上にしてください。')).isLength({min: 6});

  req.getValidationResult()
    .then(result => {
      if ( result.isEmpty() ) {
        return next();
      }
      res.validationErrors(result.array());
    })
    .catch(error => {
      res.serverError({}, error);
    })
};
