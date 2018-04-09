'use strict';

module.exports = asyncWrap(async (req, res, next) => {
  let campaignId = req.params.id;

  if (!sails.helpers.isMongoId(campaignId))
    return res.badRequest(sails.errors.idMalformed);

  let isAuctionExist = await Campaign.count({ _id: campaignId });
  if (!isAuctionExist) return res.badRequest(sails.errors.auctionNotFound);

  next();
});
