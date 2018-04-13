"use strict";

module.exports = asyncWrap(async (req, res, next) => {
    let discountTickets = req.body.discountTickets || [];
    let auctions = req.body.auctions;

    let errors = [];
    let totalValueDiscount = 0;

    let deposit = await AuctionRepository.getDepositBalance(req.user.accessToken);
    let value1Chance = sails.config.value1Chance;

    if (discountTickets === undefined || discountTickets === null || discountTickets.length === 0) {
        let totalAmount = 0;
        for(let i = 0; i < auctions.length; i++) {
            totalAmount += auctions[i].amount;
        }

        if(!deposit || deposit < totalAmount*value1Chance) {
            let objError = {
                message: sails.errors.enoughCoinChanceBuy.message,
                code: sails.errors.enoughCoinChanceBuy.code
            };
            errors.push(objError);
        }
    } else {
        if (!discountTickets || !Array.isArray(discountTickets) || !discountTickets.length)
            return res.badRequest(sails.errors.discountTicketsParamMalformed);

        for (let i = 0; i < discountTickets.length; i++) {
            let discountTicketId = discountTickets[i].id;
            if (!discountTicketId) continue;
            let objError = {};
            let isDiscountTicketIdValid = sails.helpers.isMongoId(discountTicketId);
            if (!isDiscountTicketIdValid) {
                objError = {
                    message: sails.errors.discountTicketIdNullOrMalformed.message,
                    code: sails.errors.discountTicketIdNullOrMalformed.code,
                    discountTicketId: discountTicketId
                };
                errors.push(objError);
            } else if (! await DiscountTicketRepository.isDiscountTicketExist(discountTicketId)) {
                objError = {
                    message: sails.errors.discountTicketNotFound.message,
                    code: sails.errors.discountTicketNotFound.code,
                    discountTicketId: discountTicketId
                };
                errors.push(objError);
            } else if (! await DiscountTicketRepository.isDiscountTicketExpire(discountTicketId)) {
                objError = {
                    message: sails.errors.discountTicketExpired.message,
                    code: sails.errors.discountTicketExpired.code,
                    discountTicketId: discountTicketId
                };
                errors.push(objError);
            } else {
                let value = await DiscountTicketRepository.getValueDiscount(discountTicketId);
                totalValueDiscount += value;
                let totalAmount = 0;
                for(let i = 0; i< auctions.length; i++) {
                    totalAmount += auctions[i].amount;
                }

                if (totalAmount*value1Chance < totalValueDiscount) {
                    objError = {
                        message: sails.errors.totalBuyLesserTotalDiscount.message,
                        code: sails.errors.totalBuyLesserTotalDiscount.code
                    };
                    errors.push(objError);
                } else if(!deposit || deposit < (totalAmount*value1Chance - totalValueDiscount)) {
                    objError = {
                        message: sails.errors.enoughCoinChanceBuy.message,
                        code: sails.errors.enoughCoinChanceBuy.code
                    };
                    errors.push(objError);
                }
            }
        }
    }

    if (errors.length) {
        let discountTicket = null;
        if (errors[0].code !== 63 && errors[0].code !== 57 && errors[0].code !== 67)
            discountTicket = await DiscountTicketRepository.findDiscountTicketValidate(errors[0].discountTicketId);
        return res.badRequest({
            data: discountTicket,
            message: errors[0].message,
            code: errors[0].code
        });
    }

    next();
});
