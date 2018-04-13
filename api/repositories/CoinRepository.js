/**
 * Created by daulq on 9/13/17.
 */
const faker = require("faker");

module.exports = {

    /**
     * Function coinByUser.
     * @description Get coin of user.
     * @param {ObjectId()} user id of user
     * @returns {Promise.<*>}
     */

    coinByUser: async (user) => {
        let userCoin = await UserCoin.findOne({user});
        sails.log(userCoin);
        if(userCoin) {
            return userCoin.coin;
        }

        return 0;
    },

    /**
     * Function coinExchange.
     * @description Exchange point to coin
     * @param {ObjectId()} user id of user
     * @param {Number} point point for exchange
     * @returns {Promise.<*>}
     */

    coinExchange: async (user, point) => {
        if(point / sails.config.coinExchangeRatio >= 1) {
            let userPoint = await UserPoint.findOne({user});
            console.log(userPoint);

            // Check point for exchange
            if(!userPoint) {
                userPoint = await UserPoint.create({
                    user,
                    point: 0
                });
                return sails.errors.pointNotEnough;
            }
            if(userPoint.point < point) {
                return sails.errors.pointNotEnough;
            }

            // Save new point and new coin
            let coin = parseInt(point / sails.config.coinExchangeRatio);
            let newPoint = userPoint.point - (sails.config.coinExchangeRatio*coin);

            await UserPoint.update({user}, {$set:{point:newPoint}}, {new:true});

            // Random code
            let code = faker.random.alphaNumeric(10);
            let checkCode = await LogUserCoinExchange.count({code});
            while(checkCode !== 0) {
                code = faker.random.alphaNumeric(10);
                checkCode = await LogUserCoinExchange.count({code});
            }
            let dataLog = {
                user,
                point,
                coin,
                status: 1,
                code
            };
            // Save log
            let logUserCoinExchange = await LogUserCoinExchange.create(dataLog);

            // Add coin for user on BAP Platform
            let data = await AuctionRepository.postAddAmount(user, coin);

            if (data.status && data.status !== 200) {
                await LogUserCoinExchange.findByIdAndUpdate({_id: logUserCoinExchange._id}, {status: 0}, {new: true});
            }
            return true;
        }
        return sails.errors.pointIsInvalid;
    },

    /**
     * Function coinExchangeHistory.
     * @description History coin exchange.
     * @param {ObjectId()} user id of user
     * @returns {Promise.<*>}
     */

    coinExchangeHistory: async(user) => {
        let fieldSelect = "id coin createdAt status";
        return await LogUserCoinExchange.find({user}).select(fieldSelect).sort({createdAt: -1});
    },
}
