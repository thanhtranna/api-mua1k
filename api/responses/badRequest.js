/**
 * 400 (Bad Request) Handler
 *
 * Usage:
 * return res.badRequest();
 * return res.badRequest({data, message, error});
 *
 * @param  {Object} options
 *  Properties
 *    {string, object} data
 *    {string, object} message
 *    {number} error
 *    {number} status - response status
 */

module.exports = function badRequest(options = {}) {
  let { data, message, status } = options;
  const error = options.code;

  // Get access to 'res' & 'req' object
  let res = this.res,
    req = this.req;

  message = req.__(message);

  // Set status code
  res.status(status || 400);

  if (!data) {
    data = null;
  }

  return res.jsonx({
    status: status || 400,
    data: data,
    message: message || req.__('bad_request'),
    error: error || 400
  });
};
