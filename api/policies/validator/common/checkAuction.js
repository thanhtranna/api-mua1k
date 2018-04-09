'use strict';

module.exports = asyncWrap(async (req, res, next) => {
  let auctionId = req.params.auctionid;

  if (!sails.helpers.isMongoId(auctionId))
    return res.badRequest(sails.errors.idMalformed);

  let auction = await Auction.findOne({
    _id: auctionId,
    deletedAt: { $exists: false }
  });

  if (!auction) return res.badRequest(sails.errors.auctionNotFound);

  req.auction = auction;
  next();
});
