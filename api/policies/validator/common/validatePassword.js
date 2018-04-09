/**
 * This file will validate password
 */
module.exports = function(req, res, next) {
  req.checkBody('password', req.__('password_id_required')).notEmpty();
  req
    .checkBody('password', req.__('password_min_6_chars'))
    .isLength({ min: 6 });

  req
    .getValidationResult()
    .then(result => {
      if (result.isEmpty()) {
        return next();
      }
      res.validationErrors(result.array());
    })
    .catch(error => {
      res.serverError({}, error);
    });
};
