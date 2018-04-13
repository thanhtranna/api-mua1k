"use strict";

module.exports = (req, res, next) => {

    if (!req.admin) return res.unauthorized();

    next();

};
