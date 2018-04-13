"use strict";

const LogAuctionWinnerRepository = {

    findLast50SuccessAuctions: async (time) => {
        try {
            let last50SuccessAuctions = await LogAuctionWinner
                .find({
                    finishAt: {$lt: time}
                })
                .populate('user', 'nickname')
                .select('user auction luckyNumber finishAt')
                .sort({finishAt: -1})
                .limit(50)
                .lean();

            last50SuccessAuctions.forEach(log => {
                log.finishAt = moment(log.finishAt).format('YYYY-MM-DD H:mm:ss SSS')
            });
            return last50SuccessAuctions;
        }
        catch (error) {
            throw error;
        }
    }

};

module.exports = LogAuctionWinnerRepository;
