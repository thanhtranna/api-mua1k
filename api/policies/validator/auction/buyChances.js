"use strict";

module.exports = asyncWrap(async (req, res, next) => {
    let auctions = req.body.auctions;
    if (!auctions || !Array.isArray(auctions) || !auctions.length)
        return res.badRequest(sails.errors.auctionsParamMalformed);

    let errors = [];

    for (let i = 0; i < auctions.length; i++) {
        let auctionId = auctions[i].id,
            amount = auctions[i].amount;

        if (!auctionId) continue;
        let objError = {};
        let isAuctionIdValid = sails.helpers.isMongoId(auctionId);
        if (!isAuctionIdValid) {
            objError = {
                message: sails.errors.auctionIdNullOrMalformed.message,
                code: sails.errors.auctionIdNullOrMalformed.code,
                auctionId: auctionId
            };
            errors.push(objError);
        } else if (! await AuctionRepository.isAuctionExist(auctionId)) {
            objError = {
                message: sails.errors.auctionNotFound.message,
                code: sails.errors.auctionNotFound.code,
                auctionId: auctionId
            };
            errors.push(objError);
        } else if (!amount || amount < 1 || !Number.isInteger(amount)) {
            objError = {
                message: sails.errors.amountMalformed.message,
                code: sails.errors.amountMalformed.code,
                auctionId: auctionId
            };
            errors.push(objError);
        } else {
            let auctionStatus = await AuctionRepository.getStatusAuction(auctionId);
            let objCheckstatus = {};
            if (auctionStatus === Auction.status.finished) {
                objCheckstatus = {
                    message: sails.errors.auctionFinished.message,
                    code: sails.errors.auctionFinished.code,
                    auctionId: auctionId
                };
                errors.push(objCheckstatus);
            } else if (auctionStatus === Auction.status.running) {
                objCheckstatus = {
                    message: sails.errors.auctionWaitingResult.message,
                    code: sails.errors.auctionWaitingResult.code,
                    auctionId: auctionId
                };
                errors.push(objCheckstatus);
            } else if (auctionStatus === Auction.status.fail) {
                objCheckstatus = {
                    message: sails.errors.auctionFailed.message,
                    code: sails.errors.auctionFailed.code,
                    auctionId: auctionId
                };
                errors.push(objCheckstatus);
            } else if (await AuctionService.getChanceAvailable(auctionId) === 0) {
                objError = {
                    message: sails.errors.auctionSoldOut.message,
                    code: sails.errors.auctionSoldOut.code,
                    auctionId: auctionId
                };
                errors.push(objError);
            } else if (await AuctionService.getChanceAvailable(auctionId) < amount) {
                objError = {
                    message: sails.errors.auctionNotEnoughChances.message,
                    code: sails.errors.auctionNotEnoughChances.code,
                    auctionId: auctionId
                };
                errors.push(objError);
            }
        }
    }

    if (errors.length) {
        let auction = null;
        if (errors[0].code !== 24)
            auction = await AuctionRepository.findAuctionValidate(errors[0].auctionId);
        return res.badRequest({
            data: auction,
            message: errors[0].message,
            code: errors[0].code
        });
    }

    next();
});
