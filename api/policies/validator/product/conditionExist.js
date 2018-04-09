'use strict';

module.exports = asyncWrap(async (req, res, next) => {
  const conditionId = req.body.condition;

  if (!conditionId) return next();

  if (!sails.helpers.isMongoId(conditionId))
    return res.badRequest(sails.errors.idMalformed);

  const isConditionExist = await Condition.count({ _id: conditionId });
  if (!isConditionExist) return res.notFound(sails.errors.conditionNotFound);

  next();
});
