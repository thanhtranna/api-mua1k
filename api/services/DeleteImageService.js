'use strict';

/**
 *
 * @type {{deleteOldImage: (function(*))}}
 */

const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

module.exports = {
  /**
   * Delete OldImage
   * @param {string} urlImage
   * @param {string} options
   *    {pathOrigin}    pathOrigin : url origin image
   *    {pathThumbnail} pathThumbnail : url thumbnail image
   */
  deleteOldImage: (urlImage, option = {}) => {
    let pathOrigin =
      option.pathOrigin ||
      path.resolve(sails.config.appPath, '.tmp/uploads/origin');
    let pathThumbnail =
      option.pathThumbnail ||
      path.resolve(sails.config.appPath, '.tmp/uploads/thumbnail');
    let name = sails.helpers.getNameImage(urlImage);
    return new Promise((resolve, reject) => {
      if (sails.config.environment === 'production') {
        let skipper = require('skipper-s3')({
          key: sails.config.s3.key,
          secret: sails.config.s3.secret,
          bucket: sails.config.s3.bucket
        });
        skipper.rm(urlImage, function(err, result) {
          if (err) reject(err);
          else resolve(result);
        });
      }
      fs.unlink(`${pathOrigin}/${name}`, function(err, result) {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
      fs.unlink(`${pathThumbnail}/${name}`, function(err, result) {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
  }
};
