/**
 * 403 (Forbidden) Handler
 *
 * Usage:
 * return res.forbidden();
 * return res.forbidden({err, message });
 *
 * @param  {Object} options
 *    {string, object} message
 *    {number} error
 * e.g.:
 * ```
 * return res.forbidden('Access denied.');
 * ```
 */

module.exports = function forbidden(options = {}) {
  // Get access to `req`, `res`, & `sails`
  const { message, error } = options;

  // Get access to 'res' & 'req' object
  const res = this.res,
    req = this.req;

  // Set status code
  res.status(403);

  return res.jsonx({
    status: 403,
    message: message || req.__('request_forbidden'),
    error: error || 403
  });
};
