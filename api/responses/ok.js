/**
 * 200 (OK) Response
 *
 * Usage:
 * return res.ok();
 * return res.ok({data: dataReturn, message: "message here"});
 *
 * @param  {Object} options
 *    {String|Object} data
 *    {String|Object} message
 *          - pass string to render specified view
 */

module.exports = function sendOK(options = {}) {
  let { data, message } = options;

  const res = this.res,
    req = this.req;

  // Set status code
  res.status(200);

  return res.jsonx({
    status: 200,
    data: data || null,
    message: message || req.__('success'),
    error: 0
  });
};
