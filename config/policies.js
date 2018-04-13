/**
 * Policy Mappings
 * (sails.config.policies)
 *
 * Policies are simple functions which run **before** your controllers.
 * You can apply one or more policies to a given controller, or protect
 * its actions individually.
 *
 * Any policy file (e.g. `api/policies/authenticated.js`) can be accessed
 * below by its filename, minus the extension, (e.g. "authenticated")
 *
 * For more information on how policies work, see:
 * http://sailsjs.org/#!/documentation/concepts/Policies
 *
 * For more information on configuring policies, check out:
 * http://sailsjs.org/#!/documentation/reference/sails.config/sails.config.policies.html
 */

module.exports.policies = {
  /** AccountController Police */
  AccountController: {
    postRegisterEmail: 'validator/common/validateEmail',
    postVerifyRegister: 'validator/user/verifyRegister',
    postResendRegisterVerifyCode: 'validator/common/validateEmail',
    postLogin: [
      'validator/common/validateEmail',
      'validator/common/validatePassword'
    ],

    postSendResetPasswordCode: 'validator/common/validateEmail',
    postVerifyResetPassword: 'validator/user/verifyResetPasswordCode',
    postResetPassword: [
      'validator/user/verifyResetPasswordCode',
      'validator/common/validatePassword'
    ],

    postLoginFacebook: 'validator/common/validateSocialToken',
    postLoginTwitter: 'validator/common/validateSocialToken',
    postLoginLine: 'validator/common/validateSocialToken',

    updateInvitationUser: ['verifyToken', 'validator/user/checkInvitationUser'],
    getLogout: ['verifyToken'],
    postLoginBAPPlatform: ['validator/user/checkLoginBAPPlatform']
  },

  /** ReportController Police */
  ReportController: {
    postReport: [
      'verifyToken',
      'validator/report/createReport',
      'validator/report/checkUserReport'
    ]
  },

  'Admin/UserController': {
    getUser: ['verifyAdmin', 'validator/user/userExist'],
    getUserProfile: ['verifyAdmin'],
    getMyProfile: ['verifyAdmin'],
    getUsers: ['verifyAdmin'],
    getUsersToArray: ['verifyAdmin'],
    getFilterUsers: ['verifyAdmin'],
    searchUsers: ['verifyAdmin'],
    putUserBlock: ['verifyAdmin', 'validator/user/userExist'],
    deleteUser: ['verifyAdmin', 'validator/user/userExist'],
    postUpdateUser: ['verifyAdmin', 'validator/user/userExist'],
    postTransferCoinUser: ['verifyAdmin', 'validator/user/userCoin'],
    postTransferPointUser: ['verifyAdmin', 'validator/user/userPoint'],
    getUserComments: ['verifyAdmin'],
    getUserReports: ['verifyAdmin'],
    getProductFavoriteByUser: ['verifyAdmin']
  },

  'Admin/AuctionController': {
    getAuctions: ['verifyAdmin'],
    searchAuctions: ['verifyAdmin'],
    filterAuctions: ['verifyAdmin'],
    getLogUserChanceBuys: ['verifyAdmin'],
    deleteAuction: ['verifyAdmin', 'validator/auction/AuctionExist'],
    getAuction: ['verifyAdmin', 'validator/auction/AuctionExist'],
    postAuction: [
      'verifyAdmin',
      'validator/auction/createAuction',
      'validator/product/productExist'
    ],
    putAuction: [
      'verifyAdmin',
      'validator/auction/updateAuction',
      'validator/product/productExist',
      'validator/auction/AuctionExist'
    ],
    getLogAuctions: ['verifyAdmin', 'validator/product/productExist']
  },

  /** CategoryController */
  CategoryController: {},

  /** Auction */
  AuctionController: {
    // getAuctionByCategory: 'validator/common/checkCategory',
    getAuctionHistory: 'validator/common/checkAuction',
    buyChances: [
      'verifyToken',
      'validator/auction/buyChances',
      'validator/auction/checkDiscountTicket'
    ],
    suggestList: ['verifyToken'],
    luckyNumberInfo: 'validator/common/checkAuction'
  },

  /** Review */
  ReviewController: {
    getDetailReview: 'validator/review/checkReviewExist',
    getReviewsOfAuction: 'validator/auction/AuctionExist',
    getCommentsOfReview: 'validator/review/checkReviewExist',
    createComment: [
      'verifyToken',
      'validator/review/checkReviewExist',
      'validator/review/createComment'
    ],
    likeAndUnlikeReview: ['verifyToken', 'validator/review/checkReviewExist'],
    createReview: [
      'verifyToken',
      'validator/common/checkAuction',
      'validator/auction/createReview'
    ]
  },

  /** UserController */
  UserController: {
    getMyProfile: ['verifyToken'],
    getHistoryChanceBuy: 'validator/user/userExist',
    auctionHistoryById: [
      'validator/auction/AuctionExist',
      'validator/user/userExist'
    ],
    winAuctionHistory: ['validator/user/userExist'],
    reviewList: ['validator/user/userExist'],
    changeAvatar: ['verifyToken'],
    changeNickname: ['verifyToken', 'validator/user/changeNickname'],
    addressList: ['verifyToken'],
    searchAddressByPostCode: ['verifyToken', 'validator/user/checkPostcode'],
    createAddress: ['verifyToken', 'validator/address/createAddress'],
    editAddress: [
      'verifyToken',
      'validator/address/checkAddress',
      'validator/address/createAddress'
    ],
    deleteAddress: ['verifyToken', 'validator/address/checkAddress'],
    getPointAndCoin: ['verifyToken'],
    coinExChange: ['verifyToken', 'validator/point/checkPoint'],
    coinExchangeHistory: ['verifyToken'],
    friendList: ['verifyToken'],
    checkin: ['verifyToken'],
    pointHistory: ['verifyToken'],
    auctionHistory: ['verifyToken'],
    myAuctionHistoryById: ['verifyToken'],
    myWinAuctionHistory: ['verifyToken'],
    myReviewList: ['verifyToken'],
    favoriteList: ['verifyToken'],
    createFavorite: ['verifyToken', 'validator/user/createFavorite'],
    getCoin: ['verifyToken']
  },
  DiscountTicketController: {
    discountTicketByUser: ['verifyToken']
  },
  IndexController: {
    createContact: ['validator/common/createContact']
  },

  MessageController: {
    sendMessage: [
      'verifyToken',
      'checkUserBlock',
      'validator/message/sendMessage'
    ]
  },

  'Admin/ProductController': {
    getProducts: ['verifyAdmin'],
    getAuctionProducts: ['verifyAdmin'],

    postCreate: [
      'verifyAdmin',
      'validator/product/createProduct',
      'validator/product/categoryExist',
      'validator/product/conditionExist'
    ],
    postUpdate: [
      'verifyAdmin',
      'validator/product/productExist',
      'validator/product/updateProduct',
      'validator/product/conditionExist'
    ],
    deleteProduct: ['verifyAdmin', 'validator/product/productExist'],
    detailProduct: ['verifyAdmin', 'validator/product/productExist'],
    getFilter: ['verifyAdmin'],
    favoriteProduct: ['verifyAdmin', 'validator/product/productExist']
  },

  'Admin/LogUserController': {
    '*': 'verifyAdmin'
  },

  'Admin/MessageController': {
    getMessages: ['verifyAdmin'],
    getMessage: ['verifyAdmin', 'validator/message/messageExist'],
    putUpdate: [
      'verifyAdmin',
      'validator/message/messageExist',
      'validator/message/updateMessage'
    ],
    postCreate: [
      'verifyAdmin',
      'validator/message/createMessage',
      'validator/message/categoryExist'
    ],
    deleteMessage: ['verifyAdmin', 'validator/message/messageExist'],
    filterMessage: ['verifyAdmin', 'validator/message/categoryExist']
  },

  FakerController: {
    '*': 'isFakerEnabled'
  },

  /** AuthController Admin Police */
  'Admin/AuthController': {
    postLogin: [
      'validator/common/validateEmail',
      'validator/common/validatePassword'
    ],
    getMyProfile: ['verifyAdmin'],
    getUserAdmins: ['verifyAdmin'],
    postUserAdmin: [
      'verifyAdmin',
      'validator/admin/createAdmin',
      'validator/admin/confirmPassword',
      'validator/admin/uniqueEmail'
    ],
    putUserAdmin: [
      'verifyAdmin',
      'validator/admin/updateAdmin',
      'validator/admin/confirmPassword'
    ]
  },

  'Admin/CampaignController': {
    getCampaigns: ['verifyAdmin'],
    filterCampaigns: ['verifyAdmin'],
    getCampaign: ['verifyAdmin', 'validator/campaign/campaignExist'],
    deleteCampaign: ['verifyAdmin', 'validator/campaign/campaignExist'],
    postCreate: ['verifyAdmin', 'validator/campaign/createCampaign'],
    putUpdate: ['verifyAdmin', 'validator/campaign/updateCampaign']
  },

  'Admin/CategoriesController': {
    '*': ['verifyAdmin']
  },

  'Admin/ConditionsController': {
    getConditions: ['verifyAdmin'],
    getCondition: ['verifyAdmin'],
    postCreate: ['verifyAdmin', 'validator/condition/createCondition'],
    deleteCondition: ['verifyAdmin'],
    putUpdate: ['verifyAdmin', 'validator/condition/createCondition']
  },

  'Admin/ReviewController': {
    '*': 'verifyAdmin'
  },

  'Admin/ContactCategoryController': {
    postContactCategory: [
      'verifyAdmin',
      'validator/contactCategory/checkCreate'
    ],
    getContactCategories: ['verifyAdmin'],
    putContactCategory: ['verifyAdmin'],
    deleteContactCategory: [
      'verifyAdmin',
      'validator/contactCategory/checkUpdate'
    ],
    getContactCategory: ['verifyAdmin']
  },

  'Admin/UserChanceBuyController': {
    '*': 'verifyAdmin'
  },

  'Admin/DiscountTicketController': {
    '*': 'verifyAdmin'
  },

  'Admin/FriendController': {
    '*': 'verifyAdmin'
  },

  'Admin/ContactController': {
    getContacts: ['verifyAdmin'],
    getContact: ['verifyAdmin'],
    postReplyContact: ['verifyAdmin', 'validator/contact/validationReply'],
    deleteContact: ['verifyAdmin']
  }
};
