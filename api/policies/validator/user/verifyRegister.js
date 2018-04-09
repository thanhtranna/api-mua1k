/**
 * Middleware Verify Register
 *
 * Validate fields
 *    id: required
 *    verifyCode: required, numeric
 *    nickname: required
 *    password: required, min length is 8 characters
 * Checks
 *    exist user
 *    user has verified
 *    verify code correct and expires time
 *    exist invitation user
 */

"use strict";

const moment = require("moment");

module.exports = asyncWrap(async (req, res, next) => {
    let userId = req.body.userId;
    if (!userId)
        return res.badRequest(sails.errors.verifyRegisterRequireUserId);
    if (!sails.helpers.isMongoId(userId))
        return res.badRequest(sails.errors.idMalformed);

    req.checkBody('verifyCode', req.__('require_verify_code')).notEmpty();
    req.checkBody('verifyCode', req.__('require_verify_code_numeric')).isNumeric();
    req.checkBody('nickname', req.__('require_nickname')).notEmpty();
    req.checkBody('password', req.__('require_password')).notEmpty();
    req.checkBody('password', req.__('password_min_6_chars')).isLength({min: 6});

    let validationResult = await req.getValidationResult();
    if (!validationResult.isEmpty()) return res.validationErrors(validationResult.array());

    let {verifyCode, invitationUserId} = req.body;

    // Check exist user
    let user = await User.findById(userId);
    if (!user) return res.ok({message: req.__('user_not_found')});

    // Check if user has verified
    if (user.isVerified) return res.badRequest({message: req.__('user_has_verified')});

    // Check verify code
    if (user.verifyCode !== verifyCode) {
        return res.badRequest({message: req.__('verify_code_incorrect')});
    }
    else {
        let currentTime = moment().unix(), // unix time
            timeSentCode = moment(user.updatedAt).unix(), // unix time
            expiresTime = sails.config.registerVerifyCodeExpires; // seconds
        if ((currentTime - timeSentCode) > expiresTime) {
            return res.badRequest({message: req.__('verify_code_timeout')})
        }
    }

    // Check invitation user
    if (invitationUserId) {
        if (Number(invitationUserId) === user.uid) {
            return res.badRequest({message: req.__('cannot_invite_your_self')})
        }
        else if (isNaN(invitationUserId) || Number(invitationUserId) === 0) {
            return res.badRequest({message: req.__('invitation_user_id_malformed')})
        }
        // Check exist user with invitationUserId
        let countInvitationUser = await User.count({uid: invitationUserId});
        if (!countInvitationUser) {
            return res.badRequest({message: req.__('invitation_user_not_available')})
        }
    }

    next();
});
