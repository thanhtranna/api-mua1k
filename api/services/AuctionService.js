'use strict';
const schedule = require('node-schedule');
const cheerio = require('cheerio');
const moment = require('moment');

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
      await Auction.findByIdAndUpdate(
        {
          _id: auctionId
        },
        {
          luckyNumbers: luckyNumbers
        }
      );
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
      const auctionKey = generateAuctionKey(auctionId);
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
      const auctionKey = generateAuctionKey(auctionId);
      if ((await RedisService.checkExist(auctionKey)) === 0) {
        // get lucky number in database
        const auction = await Auction.findOne({
          _id: auctionId
        });
        const luckyNumbersDB = auction.luckyNumbers;
        // remove exist key
        await RedisService.delete(auctionKey);
        // add key again
        await RedisService.add(String(auctionKey), luckyNumbersDB);
      }

      // get lucky numbers in redis
      const luckyNumbers = await RedisService.spop(auctionKey, quantity);
      // save new lucky numbers into database
      const newLuckyNumbers = await RedisService.get(auctionKey);
      await Auction.findByIdAndUpdate(
        {
          _id: auctionId
        },
        {
          luckyNumbers: newLuckyNumbers
        }
      );

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
      const auctionKey = generateAuctionKey(auctionId);
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
      let promises = await Promise.all([
        UserChanceBuyRepository.getAllUserChanceBuyByAuction(auctionId),
        AuctionRepository.getChanceNumberAuction(auctionId)
      ]);

      let sumChanceBought = 0;
      promises[0].forEach(bought => (sumChanceBought += bought.number));
      return promises[1] - sumChanceBought;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Check if auction not enough chances when user buy chances
   */
  isNotEnoughChances: async (auctionId, amount) => {
    try {
      const auctionKey = generateAuctionKey(auctionId);
      const chancesAvailable = await RedisService.scard(auctionKey);

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
        finishAt: {
          $lt: moment(finishAt).format()
        }
      })
        .select('finishAt')
        .limit(50);

      let numberA = 0;
      last50SuccessAuctions.forEach(auction => {
        let time = moment(auction.finishAt).format('HmmssSSS');
        numberA += Number(time);
      });

      return numberA;
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
      let hourFinish = moment(finishAt).format('k');

      let weatherHtmlContent = await HttpService.get(sails.config.weatherUri),
        $ = cheerio.load(weatherHtmlContent);

      let offsetRows = 2, // head row of table
        windSpeedColumn = sails.config.getWeather.windSpeedColumn, // wind
        temperatureColumn = sails.config.getWeather.temperatureColumn, // oC
        humidityColumn = sails.config.getWeather.humidityColumn, // %
        mainRow = Number(offsetRows) + Number(hourFinish); //the row we will get data

      // in html element dom format
      mainRow = `#tbl_list tbody tr:nth-child(${mainRow})`;

      let humidity = $(`${mainRow} td:nth-child(${humidityColumn})`).html();
      let temperature = $(
        `${mainRow} td:nth-child(${temperatureColumn})`
      ).html();
      let windSpeed = $(`${mainRow} td:nth-child(${windSpeedColumn})`).html();

      let numberB = String(windSpeed) + String(temperature) + String(humidity);
      numberB = numberB.replace(/\./g, '');

      if (isNaN(Number(numberB))) return false;

      return Number(numberB);
    } catch (error) {
      throw error;
    }
  },

  /**
   * Find lucky number
   * @param {object} data: auctionId, chanceNumber
   * @param {string} finishAt: time in string format
   * @param {number} numberB: numberB get from redis
   */
  findLuckyNumber: async (finishAt, data, numberB) => {
    try {
      let { auctionId, chanceNumber } = data;

      let numberA = await AuctionService.calculateNumberA(finishAt);

      let luckyNumber =
        (parseInt(numberA) + parseInt(numberB)) % parseInt(chanceNumber) +
        sails.config.startLuckyNumber;

      // Update auction status, luckyNumber
      await Auction.findOneAndUpdate(
        {
          _id: auctionId
        },
        {
          status: 3,
          luckyNumber,
          finishAt: new Date()
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
      let message = await AuctionRepository.getDetailAuction(auctionId);
      sails.log(message);
      let dataMessage = {
        message,
        type: 3
      };
      let user = await User.findById(winner.user);
      let auction = await Auction.findById(auctionId).populate('product');
      if (
        auction.product.value !== undefined &&
        auction.product.value !== null &&
        auction.product.value !== 0
      ) {
        let expiredAt = moment().add(auction.product.expDateNumber, 'days');
        await UserDiscountTicket.create({
          user: user._id,
          product: auction.product._id,
          expiredAt: expiredAt
        });
      }
      let deviceToken = '';
      if (user.deviceToken) {
        deviceToken = user.deviceToken;
      }
      FirebaseService.send(message, deviceToken);
      sails.log.info('Fire socket: auction_complete');
      sails.sockets.blast('message', JSON.stringify(dataMessage));
    } catch (error) {
      let dataMessage = {
        message: null,
        type: 3
      };
      sails.log.info('Find lucky number error: ', error);
      sails.sockets.blast('message', JSON.stringify(dataMessage));
    }
  },

  /**
   * Finish auction job
   */
  finishAuctionJob: (finishAt, data) => {
    schedule.scheduleJob(
      finishAt,
      async function(data) {
        try {
          let numberB = await RedisService.getNumberB(finishAt);

          if (numberB) {
            AuctionService.findLuckyNumber(finishAt, data, numberB);
          }
        } catch (error) {
          sails.log.error('Error when run cron job find lucky number');
          console.log(error);
        }
      }.bind(null, data)
    );
  },

  /**
   * Calculate remaining time of auction
   * @param finishAt
   */
  calculateRemainingTime: finishAt => {
    const addRemainingTime = sails.config.addRemainingTime;
    let currentTime = moment().unix(),
      finishTime = moment(finishAt)
        .add(addRemainingTime, 'm')
        .unix(),
      remainingTime = finishTime - currentTime;
    return remainingTime > 0 ? remainingTime : 0;
  },
  findMostChanceBuy: async auctionId => {
    let userChanceBuy = await UserChanceBuy.aggregate([
      {
        $match: {
          auction: sails.helpers.toObjectId(auctionId)
        }
      },
      {
        $group: {
          _id: '$user',
          totalChance: {
            $sum: '$number'
          },
          count: {
            $sum: 1
          }
        }
      }
    ]);
    let max = 0;
    let most = {};
    for (let i in userChanceBuy) {
      if (userChanceBuy[i].totalChance > max) {
        most = userChanceBuy[i];
        max = userChanceBuy[i].totalChance;
      }
    }
    most = await UserChanceBuy.findOne({
      user: most._id,
      auction: auctionId
    });
    return most;
  },

  /**
   * This cron job will running every 5 minutes
   * It will check find numberB and update to redis
   * if numberB is exist in redis, it will ignore this job
   */
  cronFindAndStoreNumberBToRedis: () => {
    schedule.scheduleJob('*/1 * * * *', async () => {
      try {
        let current = moment(),
          currentHour = current.format('k'),
          redisKey = 'numB-time-' + currentHour;

        let numberB = await RedisService.stringGet(redisKey);

        if (!numberB) {
          numberB = await AuctionService.calculateNumberB(current);
          if (numberB) await RedisService.setNumberB(redisKey, numberB);
        }

        if (numberB) {
          await AuctionService.updateAuctionWaiting(numberB);
        }
      } catch (error) {
        sails.log.error(error);
      }
    });
  },

  updateAuctionWaiting: async numberB => {
    try {
      let now = moment(),
        beginHour = moment()
          .minute(0)
          .second(0)
          .millisecond(0),
        failedAuction = await Auction.find({
          status: Auction.status.running,
          finishAt: {
            $lt: now,
            $gt: beginHour
          }
        }).sort({
          finishAt: 1
        });

      sails.log.info('Update ' + failedAuction.length + ' auction');

      for (let i = 0; i < failedAuction.length; i++) {
        let auction = failedAuction[i];
        let data = {
          auctionId: auction._id,
          chanceNumber: auction.chanceNumber
        };
        await AuctionService.findLuckyNumber(auction.finishAt, data, numberB);
      }
    } catch (error) {
      sails.log.error(error);
    }
  },
  /**
   * Return coin to users bought chance when auction expired and not sold out
   */
  cronFindAndReturnCoin: () => {
    schedule.scheduleJob('*/10 * * * *', async () => {
      try {
        let currentTime = new Date();
        let auctionsExpired = await Auction.find({
          expiredAt: {
            $lt: currentTime
          },
          status: Auction.status.waiting,
          deletedAt: {
            $exists: false
          }
        });

        sails.log.info(
          auctionsExpired.length + ' auction expired and not sold out'
        );

        if (auctionsExpired) {
          for (let i = 0; i < auctionsExpired.length; i++) {
            let auction = auctionsExpired[i];
            if (auction.luckyNumbers.length > 0) {
              let userChanceBuys = await UserChanceBuy.find({
                auction: auction._id
              });
              for (let j = 0; j < userChanceBuys.length; j++) {
                let userChanceBuy = userChanceBuys[j];
                let coinReturn =
                  parseInt(userChanceBuy.number) * sails.config.value1Chance;

                let logReturnCoin = await LogReturnCoin.create({
                  user: userChanceBuy.user,
                  coin: coinReturn,
                  status: 1
                });

                // Return coin for user on Platform
                let data = await AuctionRepository.postAddAmount(
                  userChanceBuy.user,
                  coinReturn
                );

                if (data.status && data.status !== 200) {
                  await LogReturnCoin.findByIdAndUpdate(
                    {
                      _id: logReturnCoin._id
                    },
                    {
                      status: 0
                    },
                    {
                      new: true
                    }
                  );
                }
              }
              await Auction.findByIdAndUpdate(
                {
                  _id: auction._id
                },
                {
                  $set: {
                    status: Auction.status.fail
                  }
                },
                {
                  new: true
                }
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

module.exports = AuctionService;
