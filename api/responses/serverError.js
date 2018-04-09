/**
 * 500 (Server Error) Response
 *
 * Usage:
 * return res.serverError();
 * return res.serverError(err);
 *
 * NOTE:
 * If something throws in a policy or controller, or an internal
 * error is encountered, Sails will call `res.serverError()`
 * automatically.
 * @param {Object} error - error throw in controller, polices, service ...
 * @param {string} message - custom message
 */

module.exports = function serverError(error, message) {
  // Get access to `req`, `res`, & `sails`
  const res = this.res,
    req = this.req;

  sails.log.error(error);

  // Set status code
  res.status(500);

  const response = {
    status: 500,
    data: null,
    message: message || req.__('server_error'),
    error: 500
  };

  return res.jsonx(response);
};
