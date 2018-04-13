"use strict";

module.exports = asyncWrap(async (req, res, next) => {

    let token = req.body.token;

    if (!token)
        return res.badRequest(sails.errors.requireToken);

    next();
});
