"use strict";

module.exports = asyncWrap(async (req, res, next) => {
    let user = req.body.userId ? await User.findById(req.body.userId) : req.user;
    if (user.invitationUserId)
        return res.badRequest(sails.errors.userHasInvitationUser);

    req.checkBody('invitationUserId', req.__('require_invitation_user_id')).notEmpty();
    req.checkBody('invitationUserId', req.__('invitation_user_id_require_integer')).isInt();

    let validationResult = await req.getValidationResult();
    if (!validationResult.isEmpty()) return res.validationErrors(validationResult.array());

    let invitationUserId = req.body.invitationUserId,
        isInvitationUserAvailable = await User.count({ uid: invitationUserId });

    if (Number(invitationUserId) <= 0)
        return res.badRequest({message: req.__('invitation_user_id_malformed')});

    if (user.uid === invitationUserId)
        return res.badRequest({message: req.__('cannot_invite_your_self')});

    if (!isInvitationUserAvailable)
        return res.badRequest({message: req.__('invitation_user_not_available')});

    next();
});
