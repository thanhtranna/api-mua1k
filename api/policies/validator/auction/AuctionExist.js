'use strict';

module.exports = asyncWrap(async (req, res, next) => {
  let auctionId = req.params.auctionid;
  if (!sails.helpers.isMongoId(auctionId))
    return res.badRequest(sails.errors.idMalformed);

  let isAuctionExist = await Auction.count({ _id: auctionId });
  if (!isAuctionExist) return res.notFound(sails.errors.auctionNotFound);

  next();
});
