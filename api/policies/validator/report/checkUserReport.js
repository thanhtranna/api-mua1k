"use strict";

module.exports = asyncWrap(async (req, res, next) => {
    let toUserId = req.body.userid;

    if (!sails.helpers.isMongoId(toUserId))
        return res.badRequest(sails.errors.idMalformed);

    let user = await User.count({
        _id: toUserId,
        isBlocked: false,
        deletedAt: {$exists: false}
    });

    if (!user)
        return res.badRequest(sails.errors.userNotExist);
    next();
});
