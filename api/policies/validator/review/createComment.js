'use strict';

module.exports = asyncWrap(async (req, res, next) => {
  req.checkBody('content', 'require_content').notEmpty();

  const validationResult = await req.getValidationResult();
  if (!validationResult.isEmpty())
    return res.validationErrors(validationResult.array());

  next();
});
