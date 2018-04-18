/**
 * AuctionController
 *
 * @description :: Server-side logic for managing auctions
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
  /**
   * Get all Auctions
   * @Query params:
   *    {number} page: page number in pagination
   * @Polices
   *    verifyToken
   * @return {json}
   */
  getAuctions: asyncWrap(async (req, res) => {
    const page = req.query.page || 1;
    const auctions = await AuctionRepository.getAuctions(page);
    res.ok({ data: auctions });
  }),

  /**
   * Search Auctions
   * @Query params:
   *    {number} page: page number in pagination
   * @Polices
   *    verifyToken
   * @return {json}
   */
  searchAuctions: asyncWrap(async (req, res) => {
    const page = req.query.page || 1;
    const value = req.query.value;
    const auctions = await AuctionRepository.searchAuctions(value, page);
    res.ok({ data: auctions });
  }),

  /**
   * Filter Auctions
   * @Query params:
   *    {number} page: page number in pagination
   *    {string} type: type to filter
   * @Polices
   *    verifyToken
   * @return {json}
   */
  filterAuctions: asyncWrap(async (req, res) => {
    const page = req.query.page || 1;
    const { type } = req.query;
    const categoryId = req.query.category;
    const auctions = await AuctionRepository.filterAuctions(
      type,
      page,
      categoryId
    );
    res.ok({ data: auctions });
  }),

  /**
   * Create new a Auction
   * @Body params:
   *    {string} product: product ID
   *    {boolean} isImmediateBuy: [true: allow buy now, false: don't allow buy]
   *    {boolean} isSuggest: [true: suggest, false: not suggest]
   *    {datetime} startAt: StartDate Auction
   *    {datetime} expiredAt: ExprireDate Auction
   *    {datetime} finishAt: Date get lucky number
   * @Polices
   *    verifyToken
   *    createAuction
   * @return {json}
   */
  postAuction: asyncWrap(
    async (req, res) => {
      const auction = await AuctionRepository.createAuction(req.params.all());
      res.ok({ data: auction });
    },
    (req, res, error) => {
      if (error.code === sails.errors.createAuctionFail.code)
        return res.badRequest(sails.errors.createAuctionFail);
      res.serverError(error);
    }
  ),

  /**
   * Show Detail Auction
   * @Route params:
   *    {string} auctionId: auction ID
   * @Polices
   *    verifyToken
   * @return {json}
   */
  getAuction: asyncWrap(
    async (req, res) => {
      const auctionId = req.params.auctionid;
      const auction = await AuctionRepository.getDetailAuctionForAdmin(
        auctionId
      );
      sails.log.debug(auction);
      res.ok({ data: auction });
    },
    (req, res, error) => {
      if (error.code === sails.errors.auctionNotFound.code)
        return res.badRequest(sails.errors.auctionNotFound);
      res.serverError(error);
    }
  ),

  /**
   * Edit a Auction
   * @Route params
   *    {string} auctionid: Auction ID
   * @Body params:
   *    {string} product: product ID
   *    {boolean} isImmediateBuy: [true: allow buy now, false: don't allow buy]
   *    {boolean} isSuggest: [true: suggest, false: not suggest]
   *    {datetime} startAt: StartDate Auction
   *    {datetime} expiredAt: ExprireDate Auction
   *    {datetime} finishAt: Date get lucky number
   *    {integer} status: status of current auction
   *    {interger} chanceNumber: number current chance
   *    {interger} luckyNumber: number lucky of auction
   *    {string} firstBuyUser: ID first user chance buy
   *    {string} mostBuyUser: ID most user chance buy
   *    {string} lastBuyUser: ID last user chance buy
   * @Polices
   *    verifyToken
   *    updateAuction
   * @return {json}
   */
  putAuction: asyncWrap(
    async (req, res) => {
      const auctionId = req.params.auctionid;
      const auction = await AuctionRepository.updateAuction(
        auctionId,
        req.params.all()
      );
      res.ok({ data: auction });
    },
    (req, res, error) => {
      if (error.code === sails.errors.updateAuctionFail.code)
        return res.badRequest(sails.errors.updateAuctionFail);
      res.serverError(error);
    }
  ),

  deleteAuction: asyncWrap(
    async (req, res) => {
      const auctionId = req.params.auctionid;
      let auction = await AuctionRepository.deleteAuction(auctionId);
      res.ok({ data: auction });
    },
    (req, res, error) => {
      if (error.code === sails.errors.deleteAuctionFail.code)
        return res.badRequest(sails.errors.deleteAuctionFail);
      res.serverError(error);
    }
  ),

  /**
   * Block Auction
   * @Route params:
   *    {string} auctionid: Auction ID
   * @Polices
   *    verifyToken
   * @return {json}
   */
  putAuctionBlock: asyncWrap(async (req, res) => {
    const auctionId = req.params.auctionid;
    const auction = await AuctionRepository.getDetailAuctionForAdmin(auctionId);
    const blockAuction = await Auction.findByIdAndUpdate(
      auctionId,
      { $set: { isBlocked: !auction.isBlocked } },
      { new: true }
    );
    res.ok({ data: blockAuction });
  }),

  /**
   * UnBlock Auction
   * @Route params:
   *    {string} auctionid: Auction ID
   * @Polices
   *    verifyToken
   * @return {json}
   */
  putAuctionUnBlock: asyncWrap(async (req, res) => {}),

  /**
   * Log User Chance Buys
   * @Polices
   *    verifyToken
   * @return {json}
   */
  getLogUserChanceBuys: asyncWrap(async (req, res) => {
    const page = req.params.page || 1;
    let selectFields = '';
    const populate = [
      {
        path: 'user',
        select: 'nickname avatar'
      },
      {
        path: 'auction',
        select: '-__v -createdAt -updatedAt -isSuggest'
      }
    ];
    const option = sails.helpers.optionPaginate(page, selectFields, populate);
    const logUserChanceBuy = await LogUserChanceBuy.paginate({}, option);
    res.ok({ data: logUserChanceBuy });
  }),

  /**
   * Log Auctions by Product
   * @Route params:
   *    {string} productid: Product ID
   * @Polices
   *    verifyToken
   * @return {json}
   */
  getLogAuctions: asyncWrap(async (req, res) => {
    const page = req.params.page || 1;
    const productId = req.params.productid;
    const auctions = await AuctionRepository.logAuctions(page, productId);
    res.ok({ data: auctions });
  })
};
