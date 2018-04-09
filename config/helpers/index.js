/**
 * This file export many useful function
 */

const ip = require('ip');
const MobileDetect = require('mobile-detect');
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

module.exports = {
  /**
   * Return a random number
   * @param length - number of characters - default 6 - max 15
   * @returns {string}
   */
  randomNumber: (length = 6) => {
    if (length > 15) length = 15;
    let result = '';
    for (let i = 0; i < length; i++) {
      let randomNumber = Math.floor(Math.random() * 10);
      result += String(randomNumber);
    }
    return result;
  },

  /**
   * Return request Ip Address
   * @return {string}
   */
  getUserIpAddress: () => {
    return ip.address();
  },

  /**
   * Return User Device
   * @param header - request header user-agent
   * @return {*|String|string} e.g. 'desktop', 'ios', 'android' or 'undefined'
   */
  getUserDevice: header => {
    let detect = new MobileDetect(header),
      device = detect.os();
    return device || 'undefined';
  },

  /**
   * Convert Array Object to Array
   * input = [{id: 1, name: 'foo'}, {id: 2, name: 'baz'}]
   *    arrayObjectToArrayKey(input)          => [1, 2]
   *    arrayObjectToArrayKey(input, 'name')  => ['foo', 'baz']
   * @param arrayObject
   * @param property
   */
  arrayObjectToArrayValue: (arrayObject, property = '_id') => {
    let outputArray = [];
    arrayObject.forEach(object => {
      if (object.hasOwnProperty(property)) outputArray.push(object[property]);
    });
    return outputArray;
  },

  /**
   * Return skip value in query pagination
   *    e.g Post.find({
   *          limit: 10,
   *          skip: getSkipItemByPage(page)
   *        })
   * @param page
   * @return {number}
   */
  getSkipItemByPage: page => {
    return (page - 1) * sails.config.paginateLimit;
  },

  /**
   * Calculator total pages
   * @param totalDocument
   */
  calculatorTotalPages: totalDocument => {
    return Math.ceil(totalDocument / sails.config.paginateLimit);
  },

  /**
   * Check if string is mongodb id
   * @param id
   * @return {boolean}
   */
  isMongoId: id => {
    return ObjectId.isValid(id);
  },

  /**
   * Convert string to MongoDb ObjectId
   * @param {string} id
   */
  toObjectId: id => {
    return mongoose.Types.ObjectId(id);
  },

  /**
   *
   * @param populate
   * @param page
   */
  optionPaginateAdmin: (req, populate, page = 1) => {
    let sort = {
      createdAt: -1
    };
    return {
      lean: true,
      sort: sort,
      limit: sails.config.paginateLimit,
      page: page,
      populate: populate
    };
  },

  /**
   * Convert Array Object to Array Value
   * @param arrayObject
   * @param property
   */
  transferToArrayValue: function(arrayObject, property = '_id') {
    let outputArray = [];
    arrayObject.forEach(object => {
      if (object[property] !== undefined) outputArray.push(object[property]);
    });
    return outputArray;
  },

  /**
   * Return Error instance
   * @param data - of error will create
   *      message: display when log this error
   *      code: access when by error.code
   * @return {object} error instance
   */
  generateError: data => {
    let { message, code } = data;
    let error = new Error(message);
    if (code) error.code = code;
    return error;
  },

  /**
   * Function get data coin charge
   * @returns {Array}
   */

  coinCharge: () => {
    return [
      {
        id: 1,
        coin: 100
      },
      {
        id: 2,
        coin: 300
      },
      {
        id: 3,
        coin: 500
      },
      {
        id: 4,
        coin: 2000
      },
      {
        id: 5,
        coin: 5000
      }
    ];
  },

  addressByPostcode: () => {
    return [
      {
        id: 1,
        postcode: 123,
        province: 'Tokyo',
        city: 'Tokyo'
      },
      {
        id: 1,
        postcode: 1234,
        province: 'Nagawoa',
        city: 'Nagawoa'
      },
      {
        id: 1,
        postcode: 1235,
        province: 'Kansai',
        city: 'Kansai'
      },
      {
        id: 1,
        postcode: 1236,
        province: 'Kyoto',
        city: 'Kyoto'
      }
    ];
  },

  /**
   *
   * @param populate
   * @param page
   */
  optionPaginateAuction: (page = 1, limit = sails.config.paginateLimit) => {
    let selectFieldsAuction = '-updatedAt  -isSuggest -__v';
    let selectFieldsProduct = '-updatedAt  -__v -category';
    let selectFieldsUserChanceBuy = '-__v  -updatedAt -auction';
    let selectFieldsUser = 'nickname avatar';
    let sort = {
      createdAt: -1
    };
    let populate = [
      {
        path: 'product',
        select: selectFieldsProduct
      },
      {
        path: 'firstBuyUser',
        select: selectFieldsUserChanceBuy,
        populate: {
          path: 'user',
          select: selectFieldsUser
        }
      },
      {
        path: 'mostBuyUser',
        select: selectFieldsUserChanceBuy,
        populate: {
          path: 'user',
          select: selectFieldsUser
        }
      },
      {
        path: 'lastBuyUser',
        select: selectFieldsUserChanceBuy,
        populate: {
          path: 'user',
          select: selectFieldsUser
        }
      }
    ];
    return {
      select: selectFieldsAuction,
      sort: sort,
      page: page,
      limit: limit,
      populate: populate,
      lean: true
    };
  },

  /**
   *
   * @param populate
   * @param page
   */
  optionPaginate: (
    page = 1,
    selectFields,
    populate,
    limit = sails.config.paginateLimit
  ) => {
    return {
      select: selectFields,
      page: page,
      limit: limit,
      populate: populate
    };
  },

  /**
   *
   * @param populate
   * @param page
   */
  optionPaginateUser: (page = 1, limit = sails.config.paginateLimit) => {
    let selectFields = '-__v';
    let populate = {
      path: 'address',
      select: '-__v -createdAt -updatedAt -user'
    };
    return {
      select: selectFields,
      page: page,
      limit: limit,
      populate: populate
    };
  },

  /**
   *
   * @param page
   */
  optionPaginateCampaign: (
    page = 1,
    selectFields = '-__v',
    limit = sails.config.paginateLimit
  ) => {
    return {
      select: selectFields,
      page: page,
      limit: limit
    };
  },

  /**
   *
   * @param urlImage
   * @return name
   */
  getNameImage: urlImage => {
    let pathArr = urlImage.split('/');
    let name = pathArr[pathArr.length - 1];
    return name;
  }
};
