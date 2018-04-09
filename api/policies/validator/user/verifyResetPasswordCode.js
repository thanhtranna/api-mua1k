/**
 * Verify reset password code
 * Validate fields:
 *    verifyCode: required, min length is 6 characters
 * Checks
 *    resetToken and verifyCode
 */

"use strict";
const jwt = require("jsonwebtoken");

module.exports = asyncWrap( async (req, res, next) => {
  if (!req.body.resetToken){
    return (sails.config.environment === 'development') ?
      res.badRequest({ message: 'Require resetToken'}) : res.badRequest();
  }

  req.checkBody('verifyCode', req.__('verify_code_is_required')).notEmpty();
  req.checkBody('verifyCode', req.__('verify_code_length_min_6_char')).isLength({ min: 6 });
  let validationResult = await req.getValidationResult();
  if (!validationResult.isEmpty()) return res.validationErrors(validationResult.array());

  // Verify token & code
  let { resetToken, verifyCode } = req.body;
  let jwtSecret = sails.config.jwtSecret + verifyCode;

  jwt.verify(resetToken, jwtSecret, function (error, decoded) {
    if (error) {
      return res.badRequest({ message: req.__('code_incorrect_or_timeout')});
    }
    req.jwtDecoded = decoded;
    next();
  });
});
