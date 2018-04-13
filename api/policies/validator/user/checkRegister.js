
/**
 * Middleware Check Register
 *
 * Validate fields
 *    id: required
 *    verifyCode: required, numeric
 *    nickname: required
 *    password: required, min length is 8 characters
 * Checks
 *    exist user
 *    verify code correct and expires time
 *    exist invitation user
 */

"use strict";

const moment = require("moment");

module.exports = asyncWrap(async (req, res, next) => {
    req.body.email =
        req.body && req.body.email && req.body.email.trim().toLowerCase();
    req.body.password =
        req.body && req.body.password;
    const email = req.body.email;

    req.checkBody('username', req.__('require_verify_code')).notEmpty();
    req.checkBody('username', req.__('username_min_6_chars')).isLength({min: 6});
    req.checkBody('username', req.__('username_max_255_chars')).isLength({max: 255});

    req.checkBody('email', req.__('require_email')).notEmpty();
    req.checkBody('email', req.__('email_is_required')).notEmpty();
    req.checkBody('email', req.__('email_malformed')).isEmail();

    req.checkBody('password', req.__('require_password')).notEmpty();
    req.checkBody('password', req.__('password_min_6_chars')).isLength({min: 6});
    req.checkBody('password', req.__('password_max_255_chars')).isLength({max: 255});

    req.checkBody('confirm_password', req.__('require_confirm_password')).notEmpty();
    req.checkBody('confirm_password', req.__('confirm_password_min_6_chars')).isLength({min: 6});
    req.checkBody('confirm_password', req.__('confirm_password_max_255_chars')).isLength({max: 255});

    req.checkBody('confirm_password', req.__('password_not_match')).equals(req.body.password);

    let validationResult = await req.getValidationResult();
    console.log({ validationResult });
    if (!validationResult.isEmpty()) return res.validationErrors(validationResult.array());

    // Check exist user
     const checkUserExist = await User.count({
        email
    });

    if (!!checkUserExist) {
        return res.badRequest(sails.errors.emailHasExist);
    }

    next();
});
