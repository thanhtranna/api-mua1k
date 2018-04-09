/**
 * 400 (Bad Request) Handler
 * Handle for validation errors
 * Usage:
 * return res.validationError(errors);
 *
 * @param  {Object} options
 *  Properties
 *    {string} message - error message
 *    {number} error - error code
 * @param {array, object} errors - detail of errors - return from express-validator middleware
 */

module.exports = function validationErrors(errors, options = {}) {
  let { error } = options;

  // Get access to 'res' & 'req' object
  let res = this.res,
    req = this.req;

  // Set status code
  res.status(422);

  let response = {
    status: 422,
    message: errors[0].msg || sails.errors.validationError.message,
    data: null,
    error: error ? error : sails.errors.validationError.code
  };

  if (
    sails.config.environment === 'development' ||
    sails.config.environment === 'staging'
  )
    response.devMessages = errors;

  return res.jsonx(response);
};
