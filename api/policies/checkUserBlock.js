"use strict";

module.exports = (req, res, next) => {

    if (req.user.isBlocked === true)
        return res.badRequest(sails.errors.userBlocked);
    next();

};
