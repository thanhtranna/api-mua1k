/**
 * AuctionController
 *
 * @description :: Server-side logic for managing auctions
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

    /**
     * Get Auction
     */
    getAuctions: asyncWrap(async (req, res) => {
        let type = req.query.type || 1,
            page = req.query.page || 1;

        let auctions = await AuctionRepository.getAuctionsByType(type, page);

        res.ok({data: auctions});
    }),

    /**
     * Get all Auction by category
     * @Query params:
     *    {number} page: page number in pagination
     * @Route params:
     *    {string} categoryId: product category
     * @Polices
     *    validator/common/checkCategory
     * @return {json}
     */
    getAuctionByCategory: asyncWrap(async (req, res) => {
        let categoryId = req.params.categoryid,
            page = req.query.page || 1;

        let auctions = await AuctionRepository.findByCategory({categoryId, page});
        res.ok({data: auctions});
    }),

    /**
     * Get detail of auction
     * @Route params:
     *      {string} auctionid
     * @return {json}
     */
    auctionDetail: asyncWrap(async (req, res) => {
        let auction = await AuctionRepository.getDetailAuction(req.params.auctionid);
        res.ok({data: auction});
    }, (req, res, error) => {
        if (error.code === sails.errors.auctionNotFound.code)
            return res.badRequest(sails.errors.auctionNotFound);
        res.serverError(error);
    }),

    /**
     * Return chances sold (from UserChanceBuy collection)
     * @Route params:
     *      {String} auctionid
     * @Query params:
     *      {Number} page
     * @return {json}
     */
    getAuctionChancesSold: asyncWrap(async (req, res) => {
        let auctionId = req.params.auctionid,
            page = req.query.page || 1;

        let chancesSold = await AuctionRepository.getAuctionChancesSold(auctionId, page);

        res.ok({data: chancesSold})
    }),

    /**
     * Get Auction History - return history auction success or waiting
     * @polices
     *      /validator/common/checkAuction
     * @Route params:
     *      {String} auctionid
     * @Query params:
     *      {Number} page
     * @return {json}
     */
    getAuctionHistory: asyncWrap(async (req, res) => {
        let page = req.query.page || 1;
        let product = req.auction.product;
        let auctionsHistory = await AuctionRepository.getAuctionHistory(product, page);
        res.ok({ data: auctionsHistory });
    }),

    /**
     * Get Auction waiting for find lucky number and finish
     */
    getWaitingAndFinishAuction: asyncWrap(async (req, res) => {
        let page = req.query.page || 1;

        let auctions = await AuctionRepository.getWaitingAndFinishAuction(page);

        res.ok({data: auctions})
    }),

    /**
     * Buy chance
     */
    buyChances: asyncWrap(async (req, res) => {
        let auctionsInCart = req.body.auctions;
        let discountTickets = req.body.discountTickets;
        let result = await AuctionRepository.buyChances(auctionsInCart, discountTickets, req.user._id);
        if(result.error === 1) {
            return res.badRequest(result.message);
        }
        res.ok();
    }),

    /**
     * Search Auctions
     */
    search: asyncWrap(async (req, res) => {
        let keyword = req.query.keyword,
            page = req.query.page || 1;

        if (!keyword)
            return res.badRequest(sails.errors.requireKeyword);

        let data = await AuctionRepository.getAuctionsByKeyword(keyword, page);

        res.ok({ data });
    }),

    /**
     * Function suggestList.
     * @description get list suggest auction
     * @policies
     *   verifyToken
     */
    suggestList: asyncWrap(async (req, res) => {
        let suggests = await AuctionRepository.suggestList();
        return res.ok({data:suggests});
    }),

    /**
     * Show lucky number info: number a, b ...
     * auction/:auctionid/lucky-number
     */
    luckyNumberInfo: asyncWrap(async (req, res) => {
        let data = await AuctionRepository.luckyNumberInfo(req.auction);
        res.ok({data})
    }, (req, res, error) => {
        if (error.code === sails.errors.winnerNotFound.code)
            return res.badRequest(sails.errors.winnerNotFound);
        res.serverError(error);
    }),

    getAuctionByCategories: asyncWrap(async (req, res) => {
        let page = req.query.page || 1;

        let auctions = await AuctionRepository.findByCategories(page);
        res.ok({data: auctions});
    }),
};

