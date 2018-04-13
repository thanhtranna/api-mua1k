"use strict";

module.exports = (req, res, next) => {

    if (req.headers && req.headers['faker'] === 'fk123') return next();

    res.badRequest({message: 'faker off'});

};
