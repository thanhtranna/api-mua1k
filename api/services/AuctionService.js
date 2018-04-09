'use strict';
const schedule = require('node-schedule');
const cheerio = require('cheerio');

const generateAuctionKey = auctionId => {
  return `a_numbers_${auctionId}`;
};

const AuctionService = {
  /**
   * Create array lucky numbers of auction and store it in Redis
   *      if Auction id is: acb123 and it has 10 chances, then will create a redis record like
   *          key is auction id: abc123
   *          and value is a array: [1, 2, 3, ..., 10]
   *      when user buy chances of this auction, e.g 3 chances, we will use redis `spop` function
   *      to get three random members of this array and remove them from origin array
   *          e.g three members return from `spop` is [1,4,8]
   *          and now RedisService.get('abc123') return [2, 3, 5, 6, 7, 9, 10]
   * @param {string} auctionId
   * @param {number} quantityOfChances
   * @return {Promise.<void>}
   */
  createArrayLuckyNumbers: async (auctionId, quantityOfChances) => {
    try {
      const auctionKey = generateAuctionKey(auctionId);
      // remove exist key
      await RedisService.delete(auctionKey);

      let luckyNumbers = [];
      for (let i = 0; i < quantityOfChances; i++) {
        luckyNumbers.push(i + sails.config.startLuckyNumber);
      }
      await RedisService.add(String(auctionKey), luckyNumbers);
    } catch (error) {
      throw error;
    }
  },

  /**
   * @param {string} auctionId
   * @return {Promise.<void>}
   */
  getAllLuckyNumbers: async auctionId => {
    try {
      let auctionKey = generateAuctionKey(auctionId);
      return await RedisService.get(auctionKey);
    } catch (error) {
      throw error;
    }
  },

  /**
   *
   * @param {string} auctionId
   * @param {number} quantity
   * @return {Promise.<void>}
   */
  getRandomLuckyNumbers: async (auctionId, quantity) => {
    try {
      let auctionKey = generateAuctionKey(auctionId);
      let luckyNumbers = await RedisService.spop(auctionKey, quantity);

      // Remove this key when auction chances sold out
      if ((await RedisService.scard(auctionKey)) === 0)
        await AuctionService.removeAuctionKeyInRedis(auctionKey);

      return luckyNumbers;
    } catch (error) {
      throw error;
    }
  },

  /**
   *
   * @param auctionId
   * @return {Promise.<void>}
   */
  removeAuctionKeyInRedis: async auctionId => {
    try {
      let auctionKey = generateAuctionKey(auctionId);
      await RedisService.delete(auctionKey);
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get Available Chances of Auction
   */
  getChanceAvailable: async auctionId => {
    try {
      let auctionKey = generateAuctionKey(auctionId);
      return await RedisService.scard(auctionKey);
    } catch (error) {
      throw error;
    }
  },

  /**
   * Check if auction not enough chances when user buy chances
   */
  isNotEnoughChances: async (auctionId, amount) => {
    try {
      let auctionKey = generateAuctionKey(auctionId);
      let chancesAvailable = await RedisService.scard(auctionKey);

      return chancesAvailable < amount;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Check if Auction sold out chances
   */
  isAuctionSoldOut: async auctionId => {
    try {
      let auctionKey = generateAuctionKey(auctionId);
      return (await RedisService.checkExist(auctionKey)) === 0;
    } catch (error) {
      throw error;
    }
  },

  /**
   *
   * @param finishAt
   * @return {Promise.<number>}
   */
  calculateNumberA: async finishAt => {
    try {
      let last50SuccessAuctions = await LogAuctionWinner.find({
        finishAt: { $lt: moment(finishAt).format() }
      })
        .select('finishAt')
        .limit(50);

      let sum = 0;

      last50SuccessAuctions.forEach(auction => {
        let time = moment(auction.finishAt).format('HmmssSSS');
        sum += Number(time);
      });

      return sum;
    } catch (error) {
      throw error;
    }
  },

  /**
   *
   * @return {Promise.<*>}
   */
  calculateNumberB: async finishAt => {
    try {
      let weatherHtmlContent = await HttpService.get(sails.config.weatherUri),
        $ = cheerio.load(weatherHtmlContent);

      let hourFinish = moment(finishAt).format('k');

      let offsetRows = 2, // head row of table
        windSpeedColumn = 5,
        temperatureColumn = 2, // oC
        humidityColumn = 7, // %
        mainRow = Number(offsetRows) + Number(hourFinish); //the row we will get info

      // in html element dom format
      mainRow = `#tbl_list tbody tr:nth-child(${mainRow})`;

      let humidity = $(`${mainRow} td:nth-child(${humidityColumn})`).html();
      let temperature = $(
        `${mainRow} td:nth-child(${temperatureColumn})`
      ).html();
      let windSpeed = $(`${mainRow} td:nth-child(${windSpeedColumn})`).html();

      let result = String(windSpeed) + String(temperature) + String(humidity);

      result = result.replace('.', '');
      result = result.replace('.', '');

      return Number(result);
    } catch (error) {
      throw error;
    }
  },

  /**
   * Find lucky number
   * @return {Promise.<*>}
   */
  calculateLuckyNumber: async (finishAt, chanceNumber) => {
    try {
      let numberA = await AuctionService.calculateNumberA(finishAt),
        numberB = await AuctionService.calculateNumberB(finishAt);

      let luckyNumber =
        (numberA + numberB) % chanceNumber + sails.config.startLuckyNumber;

      return { numberA, numberB, luckyNumber };
    } catch (error) {
      throw error;
    }
  },

  /**
   * Finish auction job
   */
  finishAuctionJob: (finishAt, data) => {
    schedule.scheduleJob(
      finishAt,
      function(data) {
        let action = async () => {
          let { auctionId, chanceNumber } = data;

          let {
            numberA,
            numberB,
            luckyNumber
          } = await AuctionService.calculateLuckyNumber(finishAt, chanceNumber);

          // Update auction status, luckyNumber
          await Auction.findOneAndUpdate(
            { _id: auctionId },
            {
              status: 3,
              luckyNumber: luckyNumber
            }
          );

          // Find Winner
          let winner = await LogUserChanceBuy.findOne({
            auction: auctionId,
            luckyNumber: luckyNumber
          }).select('user auction');

          // create LogAuctionWinner
          let logAuctionWinner = new LogAuctionWinner({
            user: winner.user,
            auction: winner.auction,
            finishAt,
            luckyNumber,
            numberA,
            numberB
          });
          await logAuctionWinner.save();

          // Fire socket
          let socketResponseData = await AuctionRepository.getAuctionWinner(
            Auction.status.finished,
            auctionId
          );
          socketResponseData.auctionId = auctionId;
          socketResponseData.finishAt = finishAt;
          socketResponseData.luckyNumber = luckyNumber;

          sails.log.info('Fire socket: auction_complete');
          sails.sockets.blast('auction_complete', socketResponseData);
        };

        action().catch(err => {
          sails.log.info('Find lucky number error: ', err);
          sails.sockets.blast('auction_complete', { success: false });
        });
      }.bind(null, data)
    );
  },

  /**
   * Calculate remaining time of auction
   * @param finishAt
   */
  calculateRemainingTime: finishAt => {
    let currentTime = moment().unix(),
      finishTime = moment(finishAt).unix(),
      remainingTime = finishTime - currentTime;
    return remainingTime > 0 ? remainingTime : 0;
  }
};

module.exports = AuctionService;
