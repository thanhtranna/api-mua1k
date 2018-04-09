'use strict';

module.exports = asyncWrap(async (req, res, next) => {
  let auctions = req.body.auctions;

  if (!auctions || !Array.isArray(auctions) || !auctions.length)
    return res.badRequest(sails.errors.auctionsParamMalformed);

  let errors = [];
  for (let i = 0; i < auctions.length; i++) {
    let auctionId = auctions[i].id,
      amount = auctions[i].amount,
      error = [];

    if (!auctionId) continue;

    let isAuctionIdValid = sails.helpers.isMongoId(auctionId);
    if (!isAuctionIdValid)
      error.push(sails.getError(sails.errors.auctionIdNullOrMalformed));
    else if (!await AuctionRepository.isAuctionExist(auctionId))
      error.push(sails.getError(sails.errors.auctionNotFound));

    if (!amount || amount < 1 || !Number.isInteger(amount)) {
      error.push(sails.getError(sails.errors.amountMalformed));
    } else if (isAuctionIdValid) {
      if (await AuctionService.isAuctionSoldOut(auctionId))
        error.push(sails.getError(sails.errors.auctionSoldOut));
      else if (await AuctionService.isNotEnoughChances(auctionId, amount))
        error.push(sails.getError(sails.errors.auctionNotEnoughChances));
    }

    if (error.length) {
      errors.push({
        auctionId,
        errors: error
      });
    }
  }

  // todo: check user coin

  if (errors.length) res.badRequest({ data: errors });

  next();
});
