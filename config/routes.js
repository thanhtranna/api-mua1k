/**
 * Route Mappings
 * (sails.config.routes)
 *
 * Your routes map URLs to views and controllers.
 *
 * If Sails receives a URL that doesn't match any of the routes below,
 * it will check for matching files (images, scripts, stylesheets, etc.)
 * in your assets directory.  e.g. `http://localhost:1337/images/foo.jpg`
 * might match an image file: `/assets/images/foo.jpg`
 *
 * Finally, if those don't match either, the default 404 handler is triggered.
 * See `api/responses/notFound.js` to adjust your app's 404 logic.
 *
 * Note: Sails doesn't ACTUALLY serve stuff from `assets`-- the default Gruntfile in Sails copies
 * flat files from `assets` to `.tmp/public`.  This allows you to do things like compile LESS or
 * CoffeeScript for the front-end.
 *
 * For more information on configuring custom routes, check out:
 * http://sailsjs.org/#!/documentation/concepts/Routes/RouteTargetSyntax.html
 */

let httpMethods = ['get', 'post', 'put', 'patch', 'delete'],
  apiPrefix = '/api/v1';

const getNewRouteKey = function(routeKey) {
  routeKey = routeKey.toLowerCase();
  let newRouteKey = '';
  for (let method of httpMethods) {
    if (routeKey.indexOf(method) === 0) {
      let position = method.length;
      newRouteKey = [
        routeKey.slice(0, position),
        ' ',
        apiPrefix,
        routeKey.slice(position + 1)
      ].join('');
      break;
    }
  }
  return newRouteKey;
};

const generateRoutes = function(routes) {
  let newRoutes = {};
  for (let routeKey in routes) {
    let newRouteKey = getNewRouteKey(routeKey);
    newRoutes[newRouteKey] = routes[routeKey];
  }
  return newRoutes;
};

let routes = {
  // ======= Auth Routes ======= /
  'post /register/email': 'AccountController.postRegisterEmail',
  'post /login/facebook': 'AccountController.postLoginFacebook',
  'post /login/twitter': 'AccountController.postLoginTwitter',
  'post /login/line': 'AccountController.postLoginLine',
  'post /register/verify': 'AccountController.postVerifyRegister',
  'post /register/resend-verify-code':
    'AccountController.postResendRegisterVerifyCode',
  'post /login': 'AccountController.postLogin',
  'post /reset-password/email': 'AccountController.postSendResetPasswordCode',
  'post /reset-password/verify': 'AccountController.postVerifyResetPassword',
  'post /reset-password': 'AccountController.postResetPassword',
  'post /user/invitation': 'AccountController.updateInvitationUser',

  // ======= Category Routes ======= /
  'get /categories': 'CategoryController.getCategories',

  // ======= Auction Routes ======= /
  'get /search': 'AuctionController.search',
  'get /auctions': 'AuctionController.getAuctions',
  'get /auction/category/:categoryid': 'AuctionController.getAuctionByCategory',
  'get /auction/final': 'AuctionController.getWaitingAndFinishAuction',
  'post /auction/buy-chances': 'AuctionController.buyChances',
  'get /auction/suggest': 'AuctionController.suggestList',
  'get /auction/:auctionid': 'AuctionController.auctionDetail',
  'get /auction/:auctionid/log-chance-sold':
    'AuctionController.getAuctionChancesSold',
  'get /auction/:auctionid/history': 'AuctionController.getAuctionHistory',
  'post /auction/:auctionid/review': 'ReviewController.createReview',
  'get /auction/:auctionid/reviews': 'ReviewController.getReviewsOfAuction',
  'get /auction/:auctionid/lucky-number-info':
    'AuctionController.luckyNumberInfo',

  // Review & Comment review & Like review /
  'get /reviews': 'ReviewController.getAllReviews',
  'get /review/:reviewid': 'ReviewController.getDetailReview',
  'get /review/:reviewid/comments': 'ReviewController.getCommentsOfReview',
  'post /review/:reviewid/comment': 'ReviewController.createComment',
  'post /review/:reviewid/like': 'ReviewController.likeAndUnlikeReview',
  // Campaign
  'get /campaigns': 'CampaignController.getCampaigns',

  // ======= User Routes ======== /
  'get /user/me': 'UserController.getMyProfile',
  'get /user/:userId': 'UserController.getUserProfile',
  'get /user/me/auction': 'UserController.auctionHistory',
  'get /user/:id/auction': 'UserController.getHistoryChanceBuy',
  'get /user/me/auction/:auctionid': 'UserController.myAuctionHistoryById',
  'get /user/:id/auction/:auctionid': 'UserController.auctionHistoryById',
  'get /user/me/win-auction': 'UserController.myWinAuctionHistory',
  'get /user/:id/win-auction': 'UserController.winAuctionHistory',
  'get /user/me/review': 'UserController.myReviewList',
  'get /user/:id/review': 'UserController.reviewList',
  'post /user/me/change-avatar': 'UserController.changeAvatar',
  'put /user/me/edit-nickname': 'UserController.changeNickname',
  'get /image/*': 'UserController.image',
  // ======= User Address routes ======= /
  'get /user/me/address': 'UserController.addressList',
  'get /user/me/search-by-postcode': 'UserController.searchAddressByPostCode',
  'post /user/me/address/create': 'UserController.createAddress',
  'put /user/me/address/:id/edit': 'UserController.editAddress',
  'delete /user/me/address/:id/delete': 'UserController.deleteAddress',
  // ======= User Point & Coin Routes ======== /
  'get /user/me/point-coin': 'UserController.getPointAndCoin',
  'post /user/me/coin-exchange': 'UserController.coinExchange',
  'get /user/me/coin-exchange-history': 'UserController.coinExchangeHistory',
  // ======== Friend Route ========== /
  'get /user/me/friend': 'UserController.friendList',
  'get /top-invite': 'FriendController.topInviteList',
  'get /user/me/point-history': 'UserController.pointHistory',

  // ======= Charge Routes ======= /
  'get /charge': 'ChargeController.index',

  // ======= Checkin Routes ======== /
  'post /user/me/checkin': 'UserController.checkin',

  // ====== Discount ticket Routes ====== /
  'get /user/me/discount-ticket':
    'DiscountTicketController.discountTicketByUser',

  // ======= Favorite Routes ======= /
  'get /user/me/favorite': 'UserController.favoriteList',
  'post /user/me/favorite/create': 'UserController.createFavorite',

  // ====== Index Route ======= /
  'get /contact/category': 'IndexController.contactCategoryList',
  'post /contact': 'IndexController.createContact',

  // ======== Message Routes ======== /
  'post /send-message': 'MessageController.sendMessage',
  'get /messages': 'MessageController.getMessages',

  /**
   * ============================================================================================
   *  ADMIN API
   * ============================================================================================
   */

  /** ======= Auth Routes ======= */
  'post /admin/login': 'Admin/AuthController.postLogin',
  'get /admin/me': 'Admin/AuthController.getMyProfile',

  /** ======= User Routes ======= */
  'get /admin/users': 'Admin/UserController.getUsers',
  'get /admin/users/toArray': 'Admin/UserController.getUsersToArray',
  'get /admin/users/filter': 'Admin/UserController.getFilterUsers',
  'get /admin/users/search': 'Admin/UserController.searchUsers',
  'get /admin/user/:id': 'Admin/UserController.getUser',
  'post /admin/user/:id': 'Admin/UserController.postUpdateUser',
  'put /admin/user/block/:id': 'Admin/UserController.putUserBlock',
  'delete /admin/user/:id': 'Admin/UserController.deleteUser',
  'post /admin/user/trans/coin': 'Admin/UserController.postTransferCoinUser',
  'post /admin/user/trans/point': 'Admin/UserController.postTransferPointUser',

  /** ======= Product Routes ======= */
  'get /admin/product/:id': 'Admin/ProductController.detailProduct',
  'get /admin/products': 'Admin/ProductController.getProducts',
  'get /admin/products/filter': 'Admin/ProductController.getFilter',
  'post /admin/product': 'Admin/ProductController.postCreate',
  'put /admin/product/:id': 'Admin/ProductController.postUpdate',
  'delete /admin/product/:id': 'Admin/ProductController.deleteProduct',
  'put /admin/product/fav/:id': 'Admin/ProductController.favoriteProduct',

  /** ======= Logs User Routes ======= */
  'get /admin/log-user-coin-charges':
    'Admin/LogUserController.getLogUserCoinCharges',
  'get /admin/log-auction-winner':
    'Admin/LogUserController.getLogAuctionWinner',
  'get /admin/log-user-points': 'Admin/LogUserController.getLogUserPoints',
  'get /admin/log-user-coin-exchanges':
    'Admin/LogUserController.getLogUserCoinExchanges',
  'get /admin/log-reviews': 'Admin/LogUserController.getLogReviews',
  'get /admin/log-user-chance-buy':
    'Admin/LogUserController.getLogUserChanceBuys',

  /** ======= Auction Routes ======= */
  'get /admin/auctions': 'Admin/AuctionController.getAuctions',
  'get /admin/auctions/search': 'Admin/AuctionController.searchAuctions',
  'get /admin/auctions/filter': 'Admin/AuctionController.filterAuctions',
  'post /admin/auction': 'Admin/AuctionController.postAuction',
  'get /admin/auction/:auctionid': 'Admin/AuctionController.getAuction',
  'put /admin/auc/:auctionid': 'Admin/AuctionController.putAuction',
  'delete /admin/auction/:auctionid': 'Admin/AuctionController.deleteAuction',
  'put /admin/auction/block/:auctionid':
    'Admin/AuctionController.putAuctionBlock',
  'put /admin/auction/unblock/:auctionid':
    'Admin/AuctionController.putAuctionUnBlock',
  'get /admin/auctions/products': 'Admin/ProductController.getAuctionProducts',

  /** ======= Message Routes ======= */
  'get /admin/message/:id': 'Admin/MessageController.getMessage',
  'get /admin/messages': 'Admin/MessageController.getMessages',
  'post /admin/message': 'Admin/MessageController.postCreate',
  'put /admin/message/:id': 'Admin/MessageController.putUpdate',
  'delete /admin/message/:id': 'Admin/MessageController.deleteMessage',
  'post /admin/message-cate': 'Admin/MessageController.filterMessage',
  'get /admin/log-user-chance-buys':
    'Admin/AuctionController.getLogUserChanceBuys',
  'get /admin/log-auction/:productid': 'Admin/AuctionController.getLogAuctions',

  /** ======= Campaign Routes ======= */
  'get /admin/campaigns': 'Admin/CampaignController.getCampaigns',
  'get /admin/campaigns/filter': 'Admin/CampaignController.filterCampaigns',
  'get /admin/campaign/:id': 'Admin/CampaignController.getCampaign',
  'post /admin/campaign': 'Admin/CampaignController.postCreate',
  'put /admin/campaign/:id': 'Admin/CampaignController.putUpdate',
  'delete /admin/campaign/:id': 'Admin/CampaignController.deleteCampaign',

  /** ======= Category Routes ======= */
  'get /admin/categories': 'Admin/CategoryController.getCategories',

  /** ======= Condition Routes ======= */
  'get /admin/conditions': 'Admin/ConditionController.getConditions',

  /** ======= Review Routes ======= */
  'get /admin/reviews': 'Admin/ReviewController.getAllReviews',
  'put /admin/review/block/:id': 'Admin/ReviewController.blockReview',
  'put /admin/review/approve/:id': 'Admin/ReviewController.approveReview'
};

/**
 * This routes only used on development environment
 */
if (process.env.NODE_ENV !== 'production') {
  let routeOnlyUsedInDevelopment = {
    'get /faker/clean-db': 'FakerController.cleanDb',
    'get /faker/clean-all-db': 'FakerController.cleanAllDb',
    'get /faker/test': 'FakerController.test',

    // Category
    'get /faker/category/:quantity': 'FakerController.fakeCategory',

    // Production
    'get /faker/product/:quantity': 'FakerController.fakeProduct',

    // Auction
    'get /faker/auction/:quantity': 'FakerController.fakeAuction',

    // User
    'get /faker/user/:quantity': 'FakerController.fakeUser',

    // AuctionWinner
    'get /faker/auction-winner': 'FakerController.fakeAuctionWinner',
    'get /faker/chance-buy': 'FakerController.fakeUserChanceBuy',
    'get /faker/review': 'FakerController.fakeReview',

    //thienlv
    'get /faker/chance-buy-2/:quantity': 'FakerController.fakeUserChanceBuy2',
    'get /faker/winners/:quantity': 'FakerController.fakeWinner',

    // logs user coin charges
    'get /faker/log-user-coin-charges/:quantity':
      'FakerController.fakeLogUserCoinCharges',

    // logs user points
    'get /faker/log-user-points/:quantity': 'FakerController.fakeLogUserPoints',

    // logs user coin exchanges
    'get /faker/log-user-coin-exchanges/:quantity':
      'FakerController.fakeLogUserCoinExchanges',

    // tasks
    'get /faker/tasks/:quantity': 'FakerController.fakeTasks',

    // reviews
    'get /faker/reviews/:quantity': 'FakerController.fakeReviews',

    'get /faker/comments/:quantity': 'FakerController.fakeComments',

    'get /faker/likes/:quantity': 'FakerController.fakeLikes',

    // conditions
    'get /faker/condition/:quantity': 'FakerController.fakeCondition',

    // log user chance buy
    'get /faker/log-user-chance-buy/:quantity':
      'FakerController.fakeLogUserChanceBuy',

    // user coin
    'get /faker/user-coin/:quantity': 'FakerController.fakeUserCoin',

    // user point
    'get /faker/user-point/:quantity': 'FakerController.fakeUserPoint',

    // faker message
    'get /faker/message/:quantity': 'FakerController.fakeMessage',

    // faker message
    'get /faker/message-cate/:quantity': 'FakerController.fakeMessageCategory',
    'get /faker/contact-category': 'FakerController.fakeContactCategory',

    // campaign
    'get /faker/campaigns/:quantity': 'FakerController.fakeCampaigns',

    // fake Admin
    'get /faker/admin/:quantity': 'FakerController.fakeAdmins',

    // migrate db redis
    'get /faker/migrate': 'FakerController.migrateRedis',

    // create real category
    'get /faker/real-category': 'FakerController.createRealCategory',

    // log auction winner
    'get /faker/log-auction-winner/:quantity':
      'FakerController.fakeLogAuctionWinner'
  };
  routes = Object.assign({}, routes, routeOnlyUsedInDevelopment);
}
routes = generateRoutes(routes);

// Export routes
module.exports.routes = routes;
