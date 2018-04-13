/**
 * Created by daulq on 9/5/17.
 */

const redis = require('redis'),
  client = redis.createClient({
    host: 'localhost',
    port: sails.config.portRedis
  });

const RedisService = {
  add: (key, data) => {
    return new Promise((resolve, reject) => {
      client.sadd(sails.helpers.addPrefix(key), data, (err, data) => {
        if (err) {
          reject(err);
        }
        resolve(data);
      });
    });
  },
  get: key => {
    return new Promise((resolve, reject) => {
      client.smembers(sails.helpers.addPrefix(key), (err, data) => {
        if (err) {
          reject(err);
        } else {
          resolve(data);
        }
      });
    });
  },
  delete: key => {
    return new Promise((resolve, reject) => {
      client.del(sails.helpers.addPrefix(key), (err, result) => {
        if (err) {
          reject(err);
        }
        resolve(result);
      });
    });
  },
  checkExist: key => {
    return new Promise((resolve, reject) => {
      client.exists(sails.helpers.addPrefix(key), (err, data) => {
        if (err) {
          reject(err);
        }
        resolve(data);
      });
    });
  },

  /**
   * Remove and return one or multiple random members from a set
   * @param key: redis key
   * @param amount: number of members
   * @return {Promise.<array>} array members removed
   */
  spop: (key, amount) => {
    return new Promise((resolve, reject) => {
      client.spop(sails.helpers.addPrefix(key), amount, (err, data) => {
        if (err) reject(err);
        else resolve(data);
      });
    });
  },

  scard: key => {
    return new Promise((resolve, reject) => {
      client.scard(sails.helpers.addPrefix(key), (err, data) => {
        if (err) reject(err);
        else resolve(data);
      });
    });
  },

  /** Redis String SET */
  set: (key, data) => {
    return new Promise((resolve, reject) => {
      client.set(sails.helpers.addPrefix(key), data, (err, data) => {
        if (err) reject(err);
        else resolve(data);
      });
    });
  },
  stringGet: key => {
    return new Promise((resolve, reject) => {
      client.get(sails.helpers.addPrefix(key), (err, data) => {
        if (err) reject(err);
        else resolve(data);
      });
    });
  },

  /** For Auction service */
  // Todo: move to another place
  setNumberB: (key, data) => {
    return new Promise((resolve, reject) => {
      let expiresTime = 23 * 60 * 60; // 24 hours
      client.set(
        sails.helpers.addPrefix(key),
        data,
        'EX',
        expiresTime,
        (err, data) => {
          if (err) reject(err);
          else resolve(data);
        }
      );
    });
  },
  getNumberB: async finishAt => {
    try {
      let current = moment(finishAt),
        currentHour = current.format('k'),
        redisKey = 'numB-time-' + currentHour;

      return await RedisService.stringGet(redisKey);
    } catch (error) {
      throw error;
    }
  }
};

module.exports = RedisService;
