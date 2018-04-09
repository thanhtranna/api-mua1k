'use strict';

module.exports = (req, res, next) => {
  if (!req.user) return res.unauthorized();
  next();
};
