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
  findLuckyNumberAfter: 2 * 60000, // 1 minute
  // findLuckyNumberAfter: {
  //   time: 5,
  //   unit: 'm' // minute in moment.js format
  // }, // 60 minutes
  addRemainingTime: 30, // 30 minutes

  paginateLimit: 10, // number of items on one page when paginate

  auction: {
    false: -1,
    inProgressAuction: 1,
    inProgressAward: 2,
    finish: 3
  },

  user: {
    normal: 0,
    all: 1,
    blocked: 2,
    deleted: 3
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
    username: 'tranthanh.it.95@gmail.com',
    password: 'hnsbppujunfxyfsc'
  },

  /** Amazon Simple Email Service */
  sesService: {
    accessKeyId: 'AKIAJZH5MORC6T74YW6A',
    secretAccessKey: '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',
    region: 'us-west-2'
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
  weatherUri: 'http://www.jma.go.jp/jp/amedas_h/today-44132.html', // url to weather website -> is used to find lucky number
  getWeather: {
    windSpeedColumn: 5, // wind
    temperatureColumn: 2, // oC
    humidityColumn: 8 // %
  },
  BAPUri: 'http://111.221.46.238:1341/api/v1/',
  BAPUriWeb: 'http://111.221.46.238:1341/',
  BAPAppId: '1513656217640',
  BAPSecretKey: 'GvDE3scZOXprfq7wvN8TwZa4kmAypK9Z',
  redireactServer: 'http://localhost:1337/api/v1/login/callback-platform',
  redirectApp: 'kubera://shop',
  isDemo: true,
  firebaseKey:
    'AAAAQ75F3FE:APA91bH9OYcDiylNq66mAdOX6R38c7wRIr6GZimlXiKZI73hZlMzTrugpCTta1Y9pxAKUrbfeZREcX97raqr2ljWTJcuAP4bs2fdtlpxzm8wCj4cxkS6jGgU8mJsXO13BVnN4n-YfmV3'
};
