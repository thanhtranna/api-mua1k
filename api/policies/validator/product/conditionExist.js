"use strict";

module.exports = asyncWrap(async (req, res, next) => {

    let conditionId = req.body.condition;

    if (!conditionId) return next();

    if (! sails.helpers.isMongoId(conditionId))
        return res.badRequest(sails.errors.idMalformed);

    let isConditionExist = await Condition.count({_id: conditionId});
    if (!isConditionExist)
        return res.notFound(sails.errors.conditionNotFound);

    next();
});
