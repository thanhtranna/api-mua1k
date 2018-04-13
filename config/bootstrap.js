/**
 * Bootstrap
 * (sails.config.bootstrap)
 *
 * An asynchronous bootstrap function that runs before your Sails app gets lifted.
 * This gives you an opportunity to set up your data model, run jobs, or perform some special logic.
 *
 * For more information on bootstrapping your app, check out:
 * http://sailsjs.org/#!/documentation/reference/sails.config/sails.config.bootstrap.html
 */

const fse = require('fs-extra');
const path = require('path');
const events = require('events');

const mongoose = require('mongoose');
const autoIncrement = require('mongoose-auto-increment');

/** Global EventEmitter */
global.EventEmitter = new events.EventEmitter();

/**
 * Global asyncWrap function
 * Because express isn't promise-aware, you have
 * to use a wrapping function to catch any errors
 * @param fn - async function - e.g. async (req, res, next){ do await action }
 * @param errorCallback - callback to handle error
 */
global.asyncWrap = (fn, errorCallback) => {
  return (req, res, next) => {
    fn(req, res, next).catch(error => {
      if (errorCallback) {
        errorCallback(req, res, error);
      } else {
        if (sails.config.environment === 'production') {
          sails.log.error(error);
          return res.badRequest();
        }
        res.serverError(error);
      }
    });
  };
};
global.mongoose = mongoose;

module.exports.bootstrap = async function(cb) {
  try {
    /**
     * Connect MongoDb by Mongoose package
     */
    mongoose.Promise = global.Promise;
    const connect = mongoose.connect(sails.config.mongodbUri, {
      useMongoClient: true
    });
    autoIncrement.initialize(connect);
    global.autoIncrement = autoIncrement;
    mongoose.connection.on('error', () => {
      throw new Error('Mongodb Connection Error!');
    });

    /**
     * Global Moment and set timezone to Japan time
     */
    const moment = require('moment-timezone');
    moment.tz.setDefault('Asia/Tokyo');
    global.moment = moment;

    /**
     * Binding helpers to sails
     * call sails.helpers instead sails.config.helpers
     */
    sails.helpers = require('./helpers/index');

    /** Binding errors to sails
     * call via sails.errors(errorCode, req)
     */
    sails.errors = require('./errors/index').errors;
    sails.getError = require('./errors/index').getError;

    /**
     * Global Model, then you can use User, Product.. in your controllers, polices..
     */
    let modelDir = path.join(__dirname, '..', 'api/models');
    let allModelFiles = await fse.readdir(modelDir);
    for (let modelFile of allModelFiles) {
      let modelGlobalName = modelFile.replace('.js', '');
      global[modelGlobalName] = require(path.join(modelDir, modelFile));
    }

    /**
     * Implement Event/Listener like Laravel
     */
    let eventHandlersDir = path.join(__dirname, '..', 'api/events');
    let allEventHandleFiles = await fse.readdir(eventHandlersDir);
    for (let eventHandleFile of allEventHandleFiles) {
      let eventHandle = require(path.join(eventHandlersDir, eventHandleFile));
      for (let listener of eventHandle) {
        EventEmitter.on(listener.eventName, data => {
          sails.log.info(
            `${eventHandleFile.replace('.js', '')} - Executing event: ${
              listener.eventName
            }`
          );
          listener.handler(data);
        });
      }
    }

    /**
     * Global all Repositories in api/repositories
     */
    let repositoriesDir = path.join(__dirname, '..', 'api/repositories');
    let allRepositoryFiles = await fse.readdir(repositoriesDir);
    for (let repositoryFile of allRepositoryFiles) {
      let nameOfRepository = repositoryFile.replace('.js', '');
      global[nameOfRepository] = require(path.join(
        repositoriesDir,
        nameOfRepository
      ));
    }

    /** Remove all old redis key related number b */
    for (let hour = 0; hour <= 24; hour++) {
      const result = await RedisService.delete(`numB-time-${hour}`);
      sails.log.info('hour: ', hour);
      sails.log.debug('result: ', result);
    }

    /**
     * If server restart, all cron tasks will lost,
     * so we need to check and run the tasks not complete
     * this case only used on production environment
     */
    if (sails.config.environment !== 'development') {
      let auctionsNotComplete = await Auction.find({
        status: Auction.status.running,
        expiredAt: { $gt: moment().format() }
      }).select('chanceNumber finishAt');

      auctionsNotComplete.forEach(auction => {
        let data = {
          auctionId: auction.id,
          chanceNumber: auction.chanceNumber
        };
        let current = moment(),
          finishAt = moment(auction.finishAt);

        // run find lucky number immediately if current time > auction.finishAt
        if (current > finishAt)
          return AuctionService.findLuckyNumber(auction.finishAt, data);
        // else - re create job for this auction
        AuctionService.finishAuctionJob(auction.finishAt, data);
      });
    }

    /**
     * Run cron job find failed auctions and re run find lucky number for these auctions
     */
    AuctionService.cronFindAndStoreNumberBToRedis();

    /**
     * Run cron job find failed add and subtract coin on BAP Platform
     */
    TransactionService.cronFindAndSendAddCoinPlatform();
    TransactionService.cronFindAndSendSubtractCoinPlatform();
    TransactionService.cronFindAndReturnCoinPlatform();

    /**
     * Run cron job find auctions expired and not sold out to return coin for user
     */
    AuctionService.cronFindAndReturnCoin();

    /**
     * Create default a admin
     */
    AdminService.defaultAdmin();

    // Required from Sails
    // It's very important to trigger this callback method when you are finished
    // with the bootstrap!  (otherwise your server will never lift, since it's waiting on the bootstrap)
    cb();
  } catch (error) {
    sails.log.error('Error when bootstrap application');
    sails.log.error(error);
    throw error;
  }
};
