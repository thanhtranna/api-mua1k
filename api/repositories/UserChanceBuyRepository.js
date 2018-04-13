"use strict";

const ContactRepository = {

    getAllUserChanceBuyByAuction: async (auctionId) => {
        try {
            return await UserChanceBuy.find({auction: auctionId}).select('number');
        } catch (err) {
            throw err;
        }
    }
};

module.exports = ContactRepository;
