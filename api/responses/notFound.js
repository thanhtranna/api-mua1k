/**
 * 404 (Not Found) Handler
 *
 * Usage:
 * return res.notFound();
 * return res.notFound({data, message, err});
 *
 * e.g.:
 * ```
 * return res.notFound();
 * ```
 *
 * NOTE:
 * If a request doesn't match any explicit routes (i.e. `config/routes.js`)
 * or route blueprints (i.e. "shadow routes", Sails will call `res.notFound()`
 * automatically.
 * @param  {Object} options
 *    {string, object} data
 *    {string, object} message
 *    {number} error
 */

module.exports = function notFound(options = {}) {
  let { data, message, error } = options;

  // Get access to 'res' & 'req' object
  const res = this.res,
    req = this.req;

  // Only include errors in response if application environment
  // is not set to 'production'.  In production, we shouldn't
  // send back any identifying information about errors.
  if (
    sails.config.environment === 'production' &&
    sails.config.keepResponseErrors !== true
  ) {
    data = undefined;
  }

  // Set status code
  res.status(404);

  return res.jsonx({
    status: 404,
    data: data,
    message: message || req.__('not_found'),
    error: error || 404
  });
};
