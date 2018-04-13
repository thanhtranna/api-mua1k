"use strict";

const AuctionRepository = {

    /**
     * Check if auction exist or not delete
     */
    isAuctionExist: async (auctionId) => {
        try {
            let isAuctionExist = await Auction.count({
                _id: auctionId,
                deletedAt: {$exists: false}
            });
            return !!isAuctionExist;
        }
        catch (error) {
            throw error;
        }
    },

    getStatusAuction: async (auctionId) => {
        try {
            let auction = await Auction.findOne({_id: auctionId});
            return auction.status;
        } catch (error) {
            throw error;
        }
    },

    getChanceNumberAuction: async (auctionId) => {
        try {
            let auction = await Auction.findOne({_id: auctionId});
            return auction.chanceNumber;
        } catch (error) {
            throw error;
        }
    },

    /**
     * Function createAuction.
     * @description Create new auction.
     * @param {object} data
     * @returns {Promise.<data>}
     */
    createAuction: async (data) => {
        try {
            let product = await ProductRepository.findProduct(data.product);
            let numberAuction = await Auction.count({product: data.product});
            let expiredAt = moment(data.startAt).add(90, 'days');
            data.aid = numberAuction + 1;
            data.chanceNumber = product.chanceNumber;
            data.status = sails.config.auction.inProgressAuction;
            data.keyword = `${product.name} ${product.description} ${data.keyword}`;
            data.expiredAt = expiredAt;


            if (product.price >= sails.config.valuePriceIs1k) {
                if (product.price%sails.config.valuePriceIs1k == 0) data.is1kYen = true;
            } else {
                data.is1kYen = false;
            }

            let auction = await Auction.create(data);
            if (!auction)
                throw sails.helpers.generateError({
                    code: sails.errors.createAuctionFail.code,
                    message: 'Create auction fail'
                });

            await AuctionService.createArrayLuckyNumbers(auction.id, auction.chanceNumber);

            return auction;
        } catch (err) {
            throw err;
        }
    },

    /**
     * Function updateAuction.
     * @description Update auction.
     * @param auctionId
     * @param data
     * @returns {Promise.<*>}
     */
    updateAuction: async (auctionId, data) => {
        try {
            let product = await ProductRepository.findProduct(data.product);
            let numberAuction = await Auction.count({product: data.product});
            data.aid = numberAuction + 1;

            if (product.price >= sails.config.valuePriceIs1k) {
                if (product.price%sails.config.valuePriceIs1k == 0) data.is1kYen = true;
            } else {
                data.is1kYen = false;
            }

            let auction = await Auction.update({_id: auctionId}, data);
            if (!auction)
                throw sails.helper.generateError({
                    code: sails.errors.updateAuctionFail.code,
                    message: 'Update auction fail'
                });
            return auction;
        } catch (err) {
            throw err;
        }
    },

    /**
     * Return Auction with populate to Product
     * @param {string}  auctionId
     * @param {string}  productFields
     * @param {boolean} throwErrorIfAuctionNotFound
     *          true -> throw error with code auction_not_found if auction not found
     *          false -> always return promise query result
     * @return {Promise.<Query>}
     */
    findById: async (auctionId, productFields, throwErrorIfAuctionNotFound = true) => {
        try {
            if (!productFields) productFields = 'name description featureImage images price chanceNumber';

            let auction = await Auction
                .findOne({
                    _id: auctionId,
                    deletedAt: {$exists: false},
                    startAt: {$lte: new Date()},
                    expiredAt: {$gte: new Date()}
                })
                .populate('product', productFields)
                .select('-updatedAt -createdAt -isSuggest -__v -luckyNumbers')
                .lean();

            // throwErrorIfAuctionNotFound = true, let throw error
            // throwErrorIfAuctionNotFound = false, always return auction although auction is null
            if (!auction && throwErrorIfAuctionNotFound)
                throw sails.helpers.generateError({
                    code: sails.errors.auctionNotFound.code,
                    message: 'Auction not found'
                });

            return auction;
        } catch (error) {
            throw error;
        }
    },

    /**
     * Get auctions - for homepage api
     * @return {Promise.<void>}
     */
    getAuctionsByType: async (type, page) => {
        try {
            let sortByTypes = {};
            sortByTypes[Auction.types.popular] = {aid: -1, createdAt: -1};
            sortByTypes[Auction.types.expiringSoon] = {expiredAt: 1};
            sortByTypes[Auction.types.latest] = {startAt: -1};
            sortByTypes[Auction.types.highPrice] = {chanceNumber: -1};
            sortByTypes[Auction.types.lowPrice] = {chanceNumber: 1};

            let aggregateOptions = [
                {
                    $match: {
                        status: Auction.status.waiting,
                        deletedAt: {$exists: false},
                        startAt: {$lte: new Date()},
                        expiredAt: {$gte: new Date()}
                    }
                },
                {
                    $lookup: {
                        from: 'products',
                        localField: 'product',
                        foreignField: '_id',
                        as: 'products'
                    }
                },
                {
                    $lookup: {
                        from: 'userchancebuys',
                        localField: '_id',
                        foreignField: 'auction',
                        as: 'sold'
                    }
                },
                {
                    $addFields: {
                        totalSold: {$sum: '$sold.number'},
                        product: {$arrayElemAt: ['$products', 0]},
                    }
                }
            ];

            let sort = {$sort: sortByTypes[type]};
            let project = {
                $project: {
                    aid: 1,
                    product: {
                        name: 1,
                        description: 1,
                        featureImage: 1,
                        chanceNumber: 1,
                        isFavorite: 1
                    },
                    status: 1,
                    is1kYen: 1,
                    totalSold: 1,
                    expiredAt: 1,
                    numberDateExpire: 1
                }
            };
            let skip = {$skip: sails.helpers.getSkipItemByPage(page)};
            let limit = {$limit: sails.config.paginateLimit};

            aggregateOptions.push(sort);
            aggregateOptions.push(project);
            aggregateOptions.push(skip);
            aggregateOptions.push(limit);

            return await Auction.aggregate(aggregateOptions);
        }
        catch (error) {
            throw error;
        }
    },

    /**
     * Get auctions by products
     * @param auctions
     * @param {number} page
     * @return {Promise.<array>} array auctions
     */
    getAuctionByKeyword: async (auctions, page) => {
        try {
            console.log(auctions);
            return await Auction.aggregate([
                {
                    $match: {
                        status: Auction.status.waiting,
                        _id: {$in: auctions},
                        deletedAt: {$exists: false},
                        startAt: {$lte: new Date()},
                        expiredAt: {$gte: new Date()}
                    }
                },
                {
                    $lookup: {
                        from: 'products',
                        localField: 'product',
                        foreignField: '_id',
                        as: 'products'
                    }
                },
                {
                    $lookup: {
                        from: 'userchancebuys',
                        localField: '_id',
                        foreignField: 'auction',
                        as: 'sold'
                    }
                },
                {
                    $addFields: {
                        totalSold: {$sum: '$sold.number'},
                        product: {$arrayElemAt: ['$products', 0]},
                    }
                },
                {$sort: {createdAt: 1}},
                {
                    $project: {
                        aid: 1,
                        product: {
                            name: 1,
                            description: 1,
                            featureImage: 1,
                            chanceNumber: 1,
                            isFavorite: 1
                        },
                        status: 1,
                        is1kYen: 1,
                        totalSold: 1
                    }
                },
                {$skip: sails.helpers.getSkipItemByPage(page)},
                {$limit: sails.config.paginateLimit},
            ]);
        }
        catch (error) {
            throw error;
        }
    },

    getTotalAuctionByKeyword: async (auctions) => {
        try {
            let data = await Auction.aggregate([
                {
                    $match: {
                        status: Auction.status.waiting,
                        _id: {$in: auctions},
                        deletedAt: {$exists: false},
                        startAt: {$lte: new Date()},
                        expiredAt: {$gte: new Date()}
                    }
                }
            ]);
            return data.length;
        }
        catch (error) {
            throw error;
        }
    },

    /**
     * Get auctions by products
     * @param {array} products: array object id
     * @param {number} page
     * @return {Promise.<array>} array auctions
     */
    getAuctionByProducts: async (products, page) => {
        try {
            return await Auction.aggregate([
                {
                    $match: {
                        status: Auction.status.waiting,
                        product: {$in: products},
                        deletedAt: {$exists: false},
                        startAt: {$lte: new Date()},
                        expiredAt: {$gte: new Date()}
                    }
                },
                {
                    $lookup: {
                        from: 'products',
                        localField: 'product',
                        foreignField: '_id',
                        as: 'products'
                    }
                },
                {
                    $lookup: {
                        from: 'userchancebuys',
                        localField: '_id',
                        foreignField: 'auction',
                        as: 'sold'
                    }
                },
                {
                    $addFields: {
                        totalSold: {$sum: '$sold.number'},
                        product: {$arrayElemAt: ['$products', 0]},
                    }
                },
                {$sort: {createdAt: -1}},
                {
                    $project: {
                        aid: 1,
                        product: {
                            name: 1,
                            description: 1,
                            featureImage: 1,
                            chanceNumber: 1,
                            isFavorite: 1
                        },
                        status: 1,
                        is1kYen: 1,
                        totalSold: 1
                    }
                },
                {$skip: sails.helpers.getSkipItemByPage(page)},
                {$limit: sails.config.paginateLimit}
            ]);
        }
        catch (error) {
            throw error;
        }
    },

    /**
     * Get Auction by keyword (search)
     */
    getAuctionsByKeyword: async (keyword, page) => {
        try {
            // get product
            let auctions = await AuctionRepository.getArrayIdByKeyword(keyword);

            // get total result
            let totalResult = await AuctionRepository.getTotalAuctionByKeyword(auctions);

            // get auction
            auctions = await AuctionRepository.getAuctionByKeyword(auctions, page);

            return { auctions, totalResult }
        }
        catch (error) {
            throw error;
        }
    },

    /**
     * Return all auction is running of a category
     * @param data
     * @return {Promise.<*>}
     */
    findByCategory: async (data) => {
        try {
            let {categoryId, page} = data;

            // get products by category (id) -> return array id (object id)
            let arrayProductId = await ProductRepository.getArrayIdByCategory(categoryId);
            // get auctions by products id
            return await AuctionRepository.getAuctionByProducts(arrayProductId, page);
        } catch (error) {
            throw error;
        }
    },

    /**
     * Return first buy, last buy, most buy of auction
     * @param auction
     * @return {Promise.<object>}
     */
    getFirstLastMostBuy: async (auction) => {
        try {
            let firstLastMostBuy = await UserChanceBuy
                .find({
                    _id: {$in: [auction.firstBuy, auction.lastBuy, auction.mostBuy]}
                })
                .populate('user', 'uid nickname avatar')
                .select('number user');
            let firstBuy = _.find(firstLastMostBuy, {_id: auction.firstBuy}),
                lastBuy = _.find(firstLastMostBuy, {_id: auction.lastBuy}),
                mostBuy = _.find(firstLastMostBuy, {_id: auction.mostBuy});

            return {
                firstBuy: firstBuy,
                lastBuy: lastBuy,
                mostBuy: mostBuy
            }
        } catch (error) {
            throw error;
        }
    },

    /**
     *
     * @param auction
     * @return {Promise.<number>}
     */
    getChanceAvailable: async (auction) => {
        try {
            return await AuctionService.getChanceAvailable(auction._id);
        } catch (error) {
            throw error;
        }
    },

    /**
     *
     * @return {Promise.<number>}
     */
    getWinnerChanceBought: async (auctionId, userId) => {
        try {
            let winnerChanceBought = await UserChanceBuy
                .find({auction: auctionId, user: userId})
                .select('number');
            let sumChanceBought = 0;
            winnerChanceBought.forEach(bought => sumChanceBought += bought.number);
            return sumChanceBought;
        }
        catch (error) {
            throw error;
        }
    },

    /**
     * Get Auction Winner
     * @param {String, ObjectId} auctionId
     * @param {Number} auctionStatus
     * @return {Promise.<void>, Object}
     */
    getAuctionWinner: async (auctionStatus, auctionId) => {
        try {
            if (auctionStatus !== 3) return null;

            let winner = await LogAuctionWinner
                .findOne({ auction: auctionId })
                .populate('user', 'uid nickname avatar')
                .select('user -_id')
                .lean();

            // Find winner return null
            if (!winner) {
                sails.log.error('Find winner return null');
                return null;
            }

            winner.chanceBought = await AuctionRepository.getWinnerChanceBought(auctionId, winner.user);

            return winner;
        }
        catch (error) {
            throw error;
        }
    },

    findAllAuctionByProduct: async(productId) => {
        try {
            return await Auction.find({
                product: productId,
                status: { $in: [Auction.status.waiting, Auction.status.running] },
                isBlocked: false,
                deletedAt: { $exists: false }
            }).select('_id')
              .sort({createdAt: -1});
        } catch (error) {
            throw error;
        }
    },

    /**
     * Return full information of auction by id
     * @param {String} auctionId
     * @return {Promise.<Object>}
     */
    getDetailAuction: async (auctionId) => {
        try {

            // get basic auction info
            let auction = await AuctionRepository.findById(auctionId);

            let promises = [
                AuctionRepository.getFirstLastMostBuy(auction),
                AuctionRepository.getChanceAvailable(auction),
                AuctionRepository.getAuctionWinner(auction.status, auction._id),
                AuctionRepository.getAuctionChancesSold(auctionId, 1), // 1 is first page
                AuctionRepository.findAllAuctionByProduct(auction.product)
            ];

            promises = await Promise.all(promises);

            // newest auction is waiting
            if (auction.status === Auction.status.finished) {
                if (promises[4].length > 0) {
                    auction.lastestAuction = promises[4][0]._id;
                }
            }

            let firstLastMostBuy = promises[0],
                chanceAvailable = promises[1],
                winner = promises[2],
                userChanceBuy = promises[3];

            // assign first, last, most buy
            auction.firstBuy = firstLastMostBuy.firstBuy || null;
            auction.lastBuy = firstLastMostBuy.lastBuy || null;
            auction.mostBuy = firstLastMostBuy.mostBuy || null;

            // assign total chances sold
            auction.totalSold = auction.product.chanceNumber - chanceAvailable;

            // get remaining time to find lucky number, if is waiting auction (status = 2)
            if (auction.status === 2) {
                auction.remainingTime = AuctionService.calculateRemainingTime(auction.finishAt);
            }

            // assign winner
            auction.winner = winner;

            // assign userChanceBuy first page
            auction.userChanceBuy = userChanceBuy;

            return auction;
        } catch (error) {
            throw error;
        }
    },

    /**
     * Return document from collection UserChanceBuy
     * @param {String, ObjectId} auctionId
     * @param {Number} page
     * @return {Promise.<void>}
     */
    getAuctionChancesSold: (auctionId, page = 1) => {
        return UserChanceBuy
            .find({auction: auctionId})
            .populate('user', 'uid nickname avatar')
            .select('ip number createdAt user')
            .sort({createdAt: -1})
            .skip(sails.config.getSkipItemByPage(page))
            .limit(sails.config.paginateLimit);
    },

    /**
     * Return Auction History
     * @param product - product id of auction
     * @param page - pagination page
     * @return {json}
     */
    getAuctionHistory: async (product, page) => {
        try {
            let auctions = await Auction
                .find({
                    product: product,
                    status: {$in: [2, 3]},
                    isBlocked: false,
                    deletedAt: { $exists: false }
                })
                .populate('product', 'name')
                .select('aid product status luckyNumber finishAt updatedAt')
                .sort({status: 1, updatedAt: -1})
                .skip(sails.helpers.getSkipItemByPage(page))
                .limit(sails.config.paginateLimit)
                .lean();

            for (let i = 0; i < auctions.length; i++) {
                let auction = auctions[i];
                if (auction.status === 3)
                    auction.winner = await AuctionRepository.getAuctionWinner(auction.status, auction._id);
            }

            return auctions;
        }
        catch (error) {
            throw error;
        }
    },

    /**
     * Get Auction waiting for find lucky number and finish
     * @param {Number} page
     * @return {Promise.<Object>}
     */
    getWaitingAndFinishAuction: async (page) => {
        try {
            let auctions = await Auction
                .find({
                    status: {$in: [2, 3]},
                    deletedAt: {$exists: false}
                })
                .populate('product', 'name featureImage chanceNumber')
                .select('aid product status is1kYen luckyNumber finishAt')
                .sort({status: Auction.status.waiting, updatedAt: -1})
                .skip(sails.helpers.getSkipItemByPage(page))
                .limit(sails.config.paginateLimit)
                .lean();

            for (let i = 0; i < auctions.length; i++) {
                let auction = auctions[i];
                if (auction.status === 2) {
                    auction.remainingTime = AuctionService.calculateRemainingTime(auction.finishAt);
                } else {
                    // this is a auction was finish, let get winner
                    auction.winner = await AuctionRepository.getAuctionWinner(auction.status, auction._id);
                }
            }

            return auctions;
        }
        catch (error) {
            throw error;
        }
    },

    /**
     * Lucky number info
     */
    luckyNumberInfo: async (auction) => {
        try {
            if (auction.status !== Auction.status.finished) {
                return await LogAuctionWinnerRepository
                    .findLast50SuccessAuctions(new Date());
            } else {
                let winner = await LogAuctionWinner.findOne({
                    auction: auction._id
                });
                if (!winner) {
                    throw sails.helpers.generateError({
                        code: sails.errors.winnerNotFound.code,
                        message: 'Winner not found'
                    });
                }

                let last50SuccessAuctions = await LogAuctionWinnerRepository
                    .findLast50SuccessAuctions(winner.finishAt);

                return {
                    numberA: winner.numberA,
                    numberB: winner.numberB,
                    luckyNumber: winner.luckyNumber,
                    finishAt: moment(winner.finishAt).format('YYYY-MM-DD H:mm:ss SSS'),
                    chanceNumber: auction.chanceNumber,
                    weatherUrl: sails.config.weatherUri,
                    last50SuccessAuctions
                };
            }
        }
        catch (error) {
            throw error;
        }
    },

    /**
     * Buy Chances
     */
    buyChances: async (auctionsInCart, discountTickets = null, userId) => {
        try {
            let totalAmount = 0;
            let value1Chance = sails.config.value1Chance;
            let userCoin = await AuctionRepository.getDepositBalanceByUser(userId);
            if(!userCoin) {
                return {
                    error: 1,
                    message: sails.errors.enoughCoinChanceBuy
                }
            }

            for (let i = 0; i < auctionsInCart.length; i++) {
                let auctionId = auctionsInCart[i].id,
                    amount = auctionsInCart[i].amount;
                    totalAmount += auctionsInCart[i].amount;

                if (!auctionId) continue;

                let auction = await Auction
                    .findById(auctionId)
                    .populate('mostBuy', 'number')
                    .select('chanceNumber status firstBuy lastBuy mostBuy finishAt');

                // Get random lucky number for user
                let luckyNumbers = await AuctionService.getRandomLuckyNumbers(auctionId, amount);

                // create UserChanceBuy
                let userChanceBuy = await UserChanceBuy.create({
                    user: sails.helpers.toObjectId(userId),
                    auction: sails.helpers.toObjectId(auctionId),
                    number: amount,
                    ip: sails.helpers.getUserIpAddress()
                });

                // create LogUserChanceBuy
                let logs = [];
                for (let i = 0; i < luckyNumbers.length; i++) {
                    logs.push({
                        user: sails.helpers.toObjectId(userId),
                        auction: sails.helpers.toObjectId(auctionId),
                        userChanceBuy: userChanceBuy._id,
                        luckyNumber: luckyNumbers[i]
                    })
                }
                await LogUserChanceBuy.create(logs);

                // Update first, most buy
                if (!auction.firstBuy) {
                    auction.firstBuy = userChanceBuy._id;
                    auction.mostBuy = userChanceBuy._id;
                    await auction.save();
                } else {
                    let mostBuy = await AuctionService.findMostChanceBuy(auctionId);
                    auction.mostBuy = mostBuy._id;
                    await auction.save();
                }

                // If chance number of Auction out
                if (await AuctionService.getChanceAvailable(auctionId) === 0){
                    let findLuckyNumberAfter = sails.config.findLuckyNumberAfter,
                        current = new Date();
                    let finishAt = new Date(current.getTime() + findLuckyNumberAfter);

                    if (moment(finishAt).minute() === 59) finishAt = moment(finishAt).minute(58);

                    // Update last buy
                    auction.lastBuy = userChanceBuy._id;
                    auction.finishAt = finishAt;
                    auction.status = 2;
                    await auction.save();

                    AuctionService.finishAuctionJob(finishAt, {
                        auctionId: auction._id,
                        chanceNumber: auction.chanceNumber
                    });
                }
            }

            if (discountTickets !== null && !Array.isArray(discountTickets).toString() === false) {
                let totalValueDiscount = 0;

                for (let i = 0; i < discountTickets.length; i++) {
                    let discountTicketId = discountTickets[i].id;
                    let value = await DiscountTicketRepository.getValueDiscount(discountTicketId);
                    totalValueDiscount += value;
                }
                let subtractAmount = totalAmount*value1Chance-totalValueDiscount;

                // save log subtract coin
                let logSubtractCoin = await LogSubtractCoin.create({
                    user: userId,
                    coin: subtractAmount,
                    status: 1,
                });

                // subtract coin of user on BAP Platform
                let data = await AuctionRepository.postSubtractAmount(userId, subtractAmount);

                if (data.status && data.status !== 200) {
                    await LogSubtractCoin.findByIdAndUpdate({_id: logSubtractCoin._id}, {status: 0});
                }

                // remove discount ticket used
                if (discountTickets.length > 0)
                    await DiscountTicketRepository.removeDiscountTicket(discountTickets);
            } else {
                let subtractAmount = totalAmount*value1Chance;

                // save log subtract coin
                let logSubtractCoin = await LogSubtractCoin.create({
                    user: userId,
                    coin: subtractAmount,
                    status: 1,
                });

                // subtract coin of user on BAP Platform
                let data = await AuctionRepository.postSubtractAmount(userId, subtractAmount);

                if (data.status && data.status !== 200) {
                    await LogSubtractCoin.findByIdAndUpdate({_id: logSubtractCoin._id}, {status: 0});
                }
            }

            return {
                error: 0,
                message: "Success"
            }
        }
        catch (error) {
            throw error;
        }
    },


    /**
     * Function auctionByUser
     * @description Get detail history user chance buy
     * @param {objectId()} auction
     * @param {objectId()} user
     * @param page
     * @return {Promise} userChanceBuys
     */
    auctionByUser: async(auction, user, page) => {
        let options = {
            lean: true,
            limit: sails.config.paginateLimit,
            page: page,
            select: [
                '-__v',
            ],
            sort: {
                createdAt: -1
            }
        };

        let userChanceBuys = await UserChanceBuy.paginate({user, auction}, options);
        userChanceBuys = userChanceBuys.docs;
        let newData = [];
        for(let i in userChanceBuys) {
            let userChanceBuy = {...userChanceBuys[i]};
            let query = {
                user: userChanceBuy.user,
                auction:userChanceBuy.auction,
                userChanceBuy: userChanceBuy._id
            };
            userChanceBuy.logUserChanceBuy = await LogUserChanceBuy.find(query).select("_id luckyNumber");
            delete userChanceBuy.id;
            delete userChanceBuy.auction;
            delete userChanceBuy.updatedAt;
            newData.push(userChanceBuy);
        }
        return newData;
    },

    /**
     * Function auctionHistoryByUser.
     * @description Get history buy chance of auction.
     * @param id
     * @param page
     * @returns {Promise.<Array>}
     */
    auctionHistoryByUser: async (id, page) => {
        try {
            let fieldAuction = ["luckyNumber", "status", "product", "updateAt"];
            let fieldProduct = ["name", "description", "images", "featureImage", "chanceNumber"];
            let fieldUser = ["id", "nickname", "avatar", "uid"];
            let query = {
                page:page,
                limit: sails.config.paginateLimit,
                groupBy: [
                    "auction"
                ],
                populate: [
                    {
                        path: 'auction',
                        select: fieldAuction,
                        populate: [
                            {
                                path: 'product',
                                select: fieldProduct
                            }
                        ],
                    }
                ],
                lean: true,
                select: [
                    "number",
                    "ip",
                    "auction"
                ]
            };
            // let userChanceBuys = await UserChanceBuy.paginate({user:id}, query);
            let userChanceBuys = await UserChanceBuy.aggregate([
                {
                    $match: {user:sails.helpers.toObjectId(id)}
                },
                {
                    $group: {
                        _id: "$auction",
                        numberChanceBuy: {$sum: "$number"},
                        createdAt: {$max: "$createdAt"}
                    }
                },
                {
                    $skip: sails.helpers.getSkipItemByPage(page)
                },
                {
                    $limit: sails.config.paginateLimit
                },
                {
                    $sort: {
                        createdAt: -1
                    }
                }
            ]);
            for(let i in userChanceBuys) {
                userChanceBuys[i].auction = await Auction.findOne({_id: userChanceBuys[i]._id})
                    .select("luckyNumber status product updateAt chanceNumber")
                    .populate('product', fieldProduct);
            }
            let data = [];
            // userChanceBuys = userChanceBuys.docs;
            for(let i in userChanceBuys) {
                let userWinner = await LogAuctionWinner.findOne({auction:  userChanceBuys[i].auction._id}).populate({
                    path:"user",
                    select: fieldUser
                }).lean(true).select("_id user createdAt finishAt");
                let userChanceBuy = {...userChanceBuys[i]};
                if(userWinner !== null) {
                    userChanceBuy.winner = {...userWinner};
                    userChanceBuy.winner = userChanceBuy.winner.user;
                    userChanceBuy.winner.createdAt = userWinner.createdAt;
                    userChanceBuy.winner.finishAt = userWinner.finishAt;
                    userChanceBuy.winner.chanceBought = await AuctionRepository
                        .getWinnerChanceBought(userChanceBuys[i].auction._id, userWinner.user)
                } else {
                    userChanceBuy.winner = userWinner;
                }
                delete userChanceBuy.id;
                data.push(userChanceBuy);
            }
            return data;
        } catch (err) {
            throw err;
        }
    },

    getAuctions: async (page = 1) => {
        try {
            let option = sails.helpers.optionPaginateAuction(page);
            let auctions = await Auction.paginate({}, option);
            return auctions;
        } catch (err) {
            throw err;
        }
    },

    searchAuctions: async (value, page = 1) => {
        try {
            let query = {
                name: new RegExp(value),
                deletedAt: undefined
            };
            let products = await Product.find(query, ['_id', 'name']);
            let arrayProductId = sails.helpers.transferToArrayValue(products);
            let queryAuction = {product: {"$in": arrayProductId}};
            let option = sails.helpers.optionPaginateAuction(page);
            let auctions = await Auction.paginate(queryAuction, option);
            return auctions;
        } catch (err) {
            throw err;
        }
    },

    filterAuctions: async (type, page = 1, categoryId = null, limit) => {
        try {
            let query = {};
            switch (type) {
                case `${sails.config.auction.false}`:
                    query = { status: sails.config.auction.false };
                    break;
                case `${sails.config.auction.inProgressAuction}`:
                    query = { status: sails.config.auction.inProgressAuction };
                    break;
                case `${sails.config.auction.inProgressAward}`:
                    query = { status: sails.config.auction.inProgressAward };
                    break;
                case `${sails.config.auction.finish}`:
                    query = { status: sails.config.auction.finish};
                    break;
                default:
                    let arrayProductId = await ProductRepository.getArrayIdByCategory(categoryId, '_id');
                    query = { product: {"$in": arrayProductId}};
                    break;
            }
            let option = sails.helpers.optionPaginateAuction(page);
            let auctions = await Auction.paginate(query, option);
            return auctions;
        } catch (err) {
            throw err;
        }
    },

    deleteAuction: async (auctionId) => {
        try {
            let auction = await Auction.update({_id: auctionId}, {
                deletedAt: new Date()
            });
            if(!auction)
                throw sails.helpers.generateError({
                    code: sails.errors.deleteAuctionFail.code,
                    message: 'Delete auction fail'
                });
            return auction;
        } catch (err) {
            throw err;
        }
    },

    /**
     * Function winAuctionHistoryByUser
     * @description get auction winner of user
     * @param {ObjectId()} id id of user
     * @param {Number} page page of pagination
     * @returns {Promise.<Array>}
     */
    winAuctionHistoryByUser: async (id, page) => {
        try {
            let options = {
                sort : { createdAt : -1 },
                select: [
                    "auction",
                    "createdAt"
                ],
                lean: true,
                populate: [
                    {
                        path: "auction",
                        select: [
                            "id",
                            "luckyNumber",
                            "chanceNumber",
                            "product",
                            "finishAt",
                            "createdAt"
                        ],
                        populate: [
                            {
                                path: "product",
                                select: [
                                    "name",
                                    "description",
                                    "images",
                                    "featureImage"
                                ]
                            }
                        ]
                    }
                ],
                limit: sails.config.paginateLimit,
                page: page
            };
            let logAuctionWinners = await LogAuctionWinner.paginate({user:id}, options);
            logAuctionWinners = logAuctionWinners.docs;
            let newData = [];
            for(let i in logAuctionWinners) {
                let logAuctionWinner = {...logAuctionWinners[i]};
                delete logAuctionWinner.id;
                let auctionChanceBuys = await UserChanceBuy.find({user:id, auction: logAuctionWinner.auction});
                let total = 0;
                for(let j in auctionChanceBuys) {
                    total += parseInt(auctionChanceBuys[j].number);
                }
                logAuctionWinner.numberChanceBuy = total;
                newData.push(logAuctionWinner);
            }
            return newData;
        } catch (err) {
            throw err;
        }
    },

    /**
     * Log Auctions
     * @param page
     * @param productId
     * @return {Promise.<*>}
     */
    logAuctions: async(page = 1, productId) => {
        try {
            let option = sails.helpers.optionPaginateAuction(page);
            let auctions = await Auction.paginate({product: productId}, option);
            return auctions;
        } catch (err) {
            throw err;
        }
    },

    /**
     * Return full information of auction by id (Admin)
     * @param {String} auctionId
     * @return {Promise.<Object>}
     */
    getDetailAuctionForAdmin: async (auctionId) => {
        try {
            // get basic auction info
            let auction = await AuctionRepository.findByIdForAdmin(auctionId);

            let promises = [
                AuctionRepository.getFirstLastMostBuy(auction),
                AuctionRepository.getChanceAvailable(auction),
                AuctionRepository.getAuctionWinner(auction.status, auction._id),
                AuctionRepository.getAuctionChancesSold(auctionId)
            ];

            promises = await Promise.all(promises);

            let firstLastMostBuy = promises[0],
                chanceAvailable = promises[1],
                winner = promises[2],
                userChanceBuy = promises[3];

            // assign first, last, most buy
            auction.firstBuyUser = firstLastMostBuy.firstBuy;
            auction.lastBuyUser = firstLastMostBuy.lastBuy;
            auction.mostBuyUser = firstLastMostBuy.mostBuy;

            // assign chance available
            auction.chanceAvailable = chanceAvailable;

            // assign winner
            auction.winner = winner;

            // assign userChanceBuy first page
            auction.userChanceBuy = userChanceBuy;

            return auction;
        } catch (error) {
            throw error;
        }
    },

    /**
     * Return Auction with populate to Product (Admin)
     * @param {string}  auctionId
     * @param {string}  productFields
     * @param {boolean} throwErrorIfAuctionNotFound - true -> if auction not found, it will throw error with code auction_not_found
     *              false -> always return promise query result
     * @return {Promise.<Query>}
     */
    findByIdForAdmin: async (auctionId, productFields, throwErrorIfAuctionNotFound = true) => {
        try {
            if (!productFields) productFields = 'name description featureImage images price';

            let auction = await Auction
                .findOne({
                    _id: auctionId,
                    // deletedAt: {$exists: false},
                })
                .populate('product', productFields)
                .select('-updatedAt -createdAt -isSuggest -__v')
                .lean();

            // throwErrorIfAuctionNotFound = true, let throw error
            // throwErrorIfAuctionNotFound = false, always return auction although auction is null
            if (!auction && throwErrorIfAuctionNotFound)
                throw sails.helpers.generateError({
                    code: sails.errors.auctionNotFound.code,
                    message: 'Auction not found'
                });

            return auction;
        } catch (error) {
            throw error;
        }
    },

    /**
     * Function suggestList.
     * @description Get suggest auction.
     * @returns {Promise.<*|Promise>}
     */
    suggestList: async() => {
        try {
            let option = sails.helpers.optionPaginateAuction(1, 3);
            let auctions = await Auction.paginate({isSuggest:1, status:1}, option);
            auctions = auctions.docs;
            return auctions;
        } catch (err) {
            throw err;
        }

    },

    findByCategories: async (page) => {
        try {
            // get products by category (id) -> return array id (object id)
            let arrayProductId = await ProductRepository.getArrayIdByCategories();

            // get auctions by products id
            return await AuctionRepository.getAuctionByProducts(arrayProductId, page);
        } catch (error) {
            throw error;
        }
    },
    /**
     * Find product by keyword
     * @param keyword
     * @return {Promise.<{}>}
     */
    findByKeyword: async (keyword) => {
        try {
            return await Auction
                .find({ keyword: new RegExp(keyword, 'i') })
                .select('_id name');
        }
        catch (error) {
            throw error;
        }
    },
    /**
     * Get all product by keyword and return array id
     * @param {string} keyword
     * @return {Promise.<>}
     */
    getArrayIdByKeyword: async (keyword) => {
        try {
            let auctions = await AuctionRepository.findByKeyword(keyword);
            // TODO: debug why can't use helper
            let arrayId = [];
            auctions.forEach(product => {
                arrayId.push(product._id)
            });
            return arrayId;
        }
        catch (error) {
            throw error;
        }
    },

    /**
     * get Auction validation
     */
    findAuctionValidate: async (auctionId) => {
        try {
            let auction = await Auction.findOne({
                _id: sails.helpers.toObjectId(auctionId),
                deletedAt: {$exists: false},
                startAt: {$lte: new Date()},
                expiredAt: {$gte: new Date()}
            })
                .populate('product', 'name')
                .select('product aid chanceNumber status');
            return auction;
        } catch (error) {
            throw error;
        }
    },

    /**
     * @API: Get deposit balance BAP platform
     * @param: accessToken BAP platform
     * @return: deposit Current coin of user
     */
    getDepositBalance: async(accessToken) => {
      try {
          let url = `${sails.config.BAPUri}deposit-balance`;
          let deposit = 0;
          let responseData = await HttpService.getPlatform(url, accessToken);
          if (responseData.status === 200) {
            deposit = responseData.data.deposit ? responseData.data.deposit : deposit;
          }
          return deposit;
      } catch (error) {
          throw error;
      }
    },

    /**
     * @API: Get deposit balance BAP platform
     * @param: userid Server Tokubuy
     * @return: deposit Current coin of user
     */
    getDepositBalanceByUser: async(userId) => {
      try {
          let url = `${sails.config.BAPUri}deposit-balance`;
          let deposit = 0;
          let user = await User.findOne({_id: userId});
          let accessToken = user.accessToken ? user.accessToken : '';
          let responseData = await HttpService.getPlatform(url, accessToken);
          if (responseData.status === 200) {
            deposit = responseData.data.deposit ? responseData.data.deposit : deposit;
          }
          return deposit;
      } catch (error) {
          throw error;
      }
    },

    /**
     * @API: Post subtract coin of user BAP platform
     * @param: - userId Server Tokubuy
     *         - amount subtract
     * @return: data
     */
    postSubtractAmount: async(userId, amount) => {
        try {
            let url = `${sails.config.BAPUri}transaction/subtract`;
            let body = {
              "amount": amount,
              "app_id": sails.config.BAPAppId,
            };
            let user = await User.findOne({_id: userId});
            let accessToken = user.accessToken ? user.accessToken : '';
            let data = await HttpService.postPlatform(url, accessToken, body);
            return data;
        } catch (error) {

            throw error;
        }
    },

    /**
     * @API: Post add coin of user BAP platform
     * @param: - userId server Tokubuy
     *         - amount add
     * @return: data
     */
    postAddAmount: async(userId, amount) => {
        try {
            let url = `${sails.config.BAPUri}transaction/add`;
            let body = {
              "amount": amount,
              "app_id": sails.config.BAPAppId,
            };
            let user = await User.findOne({_id: userId});
            let accessToken = user.accessToken ? user.accessToken : '';
            let data = await HttpService.postPlatform(url, accessToken, body);
            return data;
        } catch (error) {
            throw error;
        }
    },
};

module.exports = AuctionRepository;
