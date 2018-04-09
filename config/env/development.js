/**
 * Development environment settings
 *
 * This file can include shared settings for a development team,
 * such as API keys or remote database passwords.  If you're using
 * a version control solution for your Sails app, this file will
 * be committed to your repository unless you add it to your .gitignore
 * file.  If your repository will be publicly viewable, don't add
 * any private information to this file!
 *
 */

module.exports = {
  /***************************************************************************
   * Set the default database connection for models in the development       *
   * environment (see config/connections.js and config/models.js )           *
   ***************************************************************************/

  mongodbUri: 'mongodb://localhost:27017/mua1k',

  jwtSecret: 'SVhhTT1jZKbH1JbpQDv2',
  jwtExpiredIn: '7 days',
  jwtResetPasswordExpiredIn: '5m',
  registerVerifyCodeExpires: 300, // seconds

  startLuckyNumber: 10001,
  findLuckyNumberAfter: {
    time: 5,
    unit: 'm' // minute in moment.js format
  }, // 60 minutes

  paginateLimit: 10, // number of items on one page when paginate

  auction: {
    false: -1,
    inProgressAuction: 1,
    inProgressAward: 2,
    finish: 3
  },

  campaign: {
    filter: {
      notActive: 0,
      active: 1,
      static: 2,
      dynamic: 3
    },
    notActive: 0,
    active: 1,
    static: 1,
    dynamic: 2
  },

  valuePriceIs1k: 1000,
  startUserId: 10001,
  value1Chance: 100, //100 coin

  /** Gmail Account For Application - Used to send mail in development */
  gmailService: {
    username: 'thanhthientk69@gmail.com',
    password: 'qpqtaptvjkvyruim'
  },

  /** Amazon Simple Email Service */
  ses: {
    key: '',
    secret: ''
  },

  /** Amazon Simple Storage Service */
  s3: {
    key: 'AKIAIA35UC4D2EIGE7VA',
    secret: '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',
    bucket: 'tokubuy',
    region: 'ap-southeast-1'
  },

  /** Redis Server */
  redis: {
    host: '127.0.0.1',
    port: 6379
  },

  port: process.env.PORT || 1337,
  coinExchangeRatio: 1000,
  limitCampaign: 5, // limit campaign return for homepage api
  weatherUri: 'http://www.jma.go.jp/jp/amedas_h/today-44132.html' // url to weather website -> is used to find lucky number
};
