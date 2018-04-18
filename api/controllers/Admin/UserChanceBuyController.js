/**
 * AuctionController
 *
 * @description :: Server-side logic for managing auctions
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
  /**
   * Get User Chance Buys
   * @Polices
   *    verifyAdmin
   * @return {json}
   */
  getUserChanceBuys: asyncWrap(async (req, res) => {
    let page = req.query.page || 1;
    let selectFields = '';
    let populate = [
      {
        path: 'user',
        select: 'nickname avatar'
      },
      {
        path: 'auction',
        select: '-__v -createdAt -updatedAt -isSuggest -luckyNumbers',
        populate: {
          path: 'product',
          select: 'name'
        }
      }
    ];
    let option = sails.helpers.optionPaginate(page, selectFields, populate);
    let userChanceBuy = await UserChanceBuy.paginate({}, option);
    res.ok({ data: userChanceBuy });
  }),

  /**
   * Log User Chance Buys
   * @Polices
   *    verifyToken
   * @return {json}
   */
  getLogUserChanceBuys: asyncWrap(async (req, res) => {
    let page = req.query.page || 1;
    let userChanceBuyId = req.params.id;
    let selectFields = '';
    let populate = [
      {
        path: 'user',
        select: 'nickname avatar'
      },
      {
        path: 'auction',
        select: '-__v -createdAt -updatedAt -isSuggest -luckyNumbers',
        populate: {
          path: 'product',
          select: 'name'
        }
      },
      {
        path: 'userChanceBuy',
        select: '-__v -createdAt -updatedAt'
      }
    ];
    let option = sails.helpers.optionPaginate(page, selectFields, populate);
    let logUserChanceBuy = await LogUserChanceBuy.paginate(
      {
        userChanceBuy: userChanceBuyId
      },
      option
    );
    res.ok({ data: logUserChanceBuy });
  })
};
