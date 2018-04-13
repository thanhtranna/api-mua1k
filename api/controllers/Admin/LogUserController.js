/**
 * ProductController
 *
 * @description :: Server-side logic for managing products
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
"use strict";

const   popUser = {path: 'user', select: '_id nickname avatar email'},
        popTask = {path: 'task'},
        popFrom = {path: 'from', select: '_id nickname avatar'},
        popAuction = { path: 'auction', select: '_id product' };

module.exports = {
    /**
     * Log User Coin Charges
     * @Query params:
     *    {number} page: page number in pagination,
     * Polices
     *    verifyToken.js
     * @return {json}
     */
    getLogUserCoinCharges: asyncWrap(async (req, res) => {
        let logs = await LogUserCoinCharge.paginate({}, sails.helpers.optionPaginateAdmin(req, popUser));
        res.ok({data: logs});
    }),

    /**
     * Log Auction Winner
     * @Query params:
     *    {number} page: page number in pagination,
     * Polices
     *    verifyToken.js
     * @return {json}
     */
    getLogAuctionWinner: asyncWrap(async (req, res) => {
        let page = req.query.page || 1;
        let query = {};
        if (req.query.filter) {
            let filter = parseInt(req.query.filter);
            if (filter === 0) {
                query = {
                    $or : [{statusWinner: {$exists: false}}, {statusWinner: filter}]
                }
            } else {
                query = {
                    statusWinner : filter
                }
            }
        }
        sails.log.debug(query);

        let logs = await LogAuctionWinner
                .paginate(query, sails.helpers
                .optionPaginateAdmin(req, [
                    popUser,
                    {
                        path: 'auction', select: '-_id product',
                        populate: {path: 'product', select: 'featureImage'}
                    }
                ], page));
        res.ok({data: logs});
    }),

    /**
     * Log User Point
     * @Query params:
     *    {number} page: page number in pagination,
     * Polices
     *    verifyToken.js
     * @return {json}
     */
    getLogUserPoints: asyncWrap(async (req, res) => {
        let page = req.query.page || 1;
        let options = sails.helpers.optionPaginateAdmin(req, [popUser, popTask, popFrom], page);
        let logs = await LogUserPoint.paginate({}, options );
        res.ok({data: logs});
    }),

    /**
     * Log User Coin Exchanges
     * @Query params:
     *    {number} page: page number in pagination,
     * Polices
     *    verifyToken.js
     * @return {json}
     */
    getLogUserCoinExchanges: asyncWrap(async (req, res) => {
        let logs = await LogUserCoinExchange.paginate({}, sails.helpers.optionPaginateAdmin(req, popUser));
        res.ok({data: logs});

    }),

    /**
     * Log Reviews
     * @Query params:
     *    {number} page: page number in pagination,
     * Polices
     *    verifyToken.js
     * @return {json}
     */
    getLogReviews: asyncWrap(async (req, res) => {
        let logs = await Review.paginate({}, sails.helpers.optionPaginateAdmin(req, popUser));
        res.ok({data: logs});
    }),

    /**
     * Log user chance buys
     * @Query params:
     *    {number} page: page number in pagination,
     * Polices
     *    verifyToken.js
     * @return {json}
     */
    getLogUserChanceBuys : asyncWrap(async (req, res) => {
        let logs = await LogUserChanceBuy.paginate({}, sails.helpers.optionPaginateAdmin(req, popUser));
        res.ok({data: logs});
    }),

    /**
     *
     */
    getLogUserCoinChargeDetail: asyncWrap(async (req, res) => {
        let page = req.query.page || 1;
        let id = req.params.id;
        let selectFields = '';
        let populate = [
            {
                path: 'user',
                select: 'nickname avatar'
            }
        ];
        let option = sails.helpers.optionPaginate(page, selectFields, populate);
        let logs = await LogUserCoinCharge.paginate({
            user: id
        }, option);
        res.ok({data : logs});
    }),

    /**
     *
     */
    confirmAuctionWinner: asyncWrap(async (req, res) => {
        let id = req.params.id;
        let logAuction = await LogAuctionWinner.findByIdAndUpdate(
            {
                _id: id
            },
            {
                statusWinner: LogAuctionWinner.statusWinner.transfering
            }
        );
        return res.ok({data: logAuction});
    }),

    /**
     *
     */
    confirmAuctionWinnerSuccessful: asyncWrap(async (req, res) => {
        let id = req.params.id;
        let logAuction = await LogAuctionWinner.findByIdAndUpdate(
            {
                _id: id
            },
            {
                statusWinner: LogAuctionWinner.statusWinner.successfull
            }
        );
        return res.ok({data: logAuction});
    }),

    /**
     *
     */
    confirmAuctionWinnerFails: asyncWrap(async (req, res) => {
        let id = req.params.id;
        let logAuction = await LogAuctionWinner.findByIdAndUpdate(
            {
                _id: id
            },
            {
                statusWinner: LogAuctionWinner.statusWinner.fails
            }
        );
        return res.ok({data: logAuction});
    }),
};

