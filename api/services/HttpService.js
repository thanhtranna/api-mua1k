'use strict';

const request = require('request');

const HttpService = {
  /**
   *
   * @param uri
   * @param bearer_token
   * @return {Promise}
   */
  get: (uri, bearer_token) => {
    return new Promise((resolve, reject) => {
      const options = {
        method: 'get',
        uri: uri,
        json: true
      };

      if (bearer_token)
        options.headers = {
          Authorization: 'Bearer ' + bearer_token
        };

      request.get(options, (error, response, body) => {
        if (error) reject(error);
        else resolve(body);
      });
    });
  },

  /**
   *
   * @param uri
   * @return {Promise}
   */
  post: uri => {
    return new Promise((resolve, reject) => {
      const options = {
        method: 'post',
        uri: uri,
        json: true
      };
      request.post(options, (error, response, body) => {
        if (error) reject(error);
        else resolve(body);
      });
    });
  },

  /**
   * Http get BAP Platform
   * @param uri
   * @param bearer_token
   * @return {Promise}
   */
  getPlatform: (uri, bearer_token) => {
    return new Promise((resolve, reject) => {
      const options = {
        method: 'get',
        uri: uri,
        json: true
      };

      if (bearer_token)
        options.headers = {
          Authorization: 'Bearer ' + bearer_token
        };

      request.get(options, (error, response, body) => {
        if (error) reject(error);
        else resolve(body);
      });
    });
  },

  /**
   * Http post BAP Platform
   * @param uri
   * @param bearer_token
   * @param data
   * @return {Promise}
   */
  postPlatform: (uri, bearer_token, data) => {
    return new Promise((resolve, reject) => {
      const options = {
        method: 'post',
        uri: uri,
        form: data,
        json: true
      };

      if (bearer_token)
        options.headers = {
          Authorization: 'Bearer ' + bearer_token
        };

      request.post(options, (error, response, body) => {
        if (error) reject(error);
        else resolve(body);
      });
    });
  }
};

module.exports = HttpService;
