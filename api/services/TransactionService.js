'use strict';
const schedule = require('node-schedule');

const TransactionService = {
  cronFindAndSendAddCoinPlatform: () => {
    schedule.scheduleJob('*/5 * * * *', async () => {
      try {
        const logUserCoinExchanges = await LogUserCoinExchange.find({
          status: 0
        }).limit(10);
        sails.log.info(`${logUserCoinExchanges.length} add coin not completed`);
        if (logUserCoinExchanges) {
          for (let i = 0; i < logUserCoinExchanges.length; i++) {
            const logUserCoinExchange = logUserCoinExchanges[i];
            const { _id, user, coin } = logUserCoinExchange;
            const data = await AuctionRepository.postAddAmount(user, coin);
            if (data.status && data.status === 200) {
              await LogUserCoinExchange.findByIdAndUpdate(
                { _id },
                { status: 1 },
                { new: true }
              );
            }
          }
        }
      } catch (error) {
        sails.log.error(error);
      }
    });
  },

  cronFindAndSendSubtractCoinPlatform: () => {
    schedule.scheduleJob('*/5 * * * *', async () => {
      try {
        const logSubtractCoins = await LogSubtractCoin.find({
          status: 0
        }).limit(10);
        sails.log.info(
          `${logSubtractCoins.length} subtract coin not completed`
        );
        if (logSubtractCoins) {
          for (let i = 0; i < logSubtractCoins.length; i++) {
            const logSubtractCoin = logSubtractCoins[i];
            const { _id, user, coin } = logSubtractCoin;
            const data = await AuctionRepository.postSubtractAmount(user, coin);
            if (data.status && data.status === 200) {
              await LogSubtractCoin.findByIdAndUpdate(
                { _id },
                { status: 1 },
                { new: true }
              );
            }
          }
        }
      } catch (error) {
        sails.log.error(error);
      }
    });
  },

  cronFindAndReturnCoinPlatform: () => {
    schedule.scheduleJob('*/5 * * * *', async () => {
      try {
        const logReturnCoins = await LogReturnCoin.find({ status: 0 }).limit(
          10
        );
        sails.log.info(`${logReturnCoins.length} return coin not completed`);
        if (logReturnCoins) {
          for (let i = 0; i < logReturnCoins.length; i++) {
            const logReturnCoin = logReturnCoins[i];
            const { _id, user, coin } = logReturnCoin;
            const data = await AuctionRepository.postAddAmount(user, coin);
            if (data.status && data.status === 200) {
              await LogReturnCoin.findByIdAndUpdate(
                { _id },
                { status: 1 },
                { new: true }
              );
            }
          }
        }
      } catch (error) {
        sails.log.error(error);
      }
    });
  }
};

module.exports = TransactionService;
