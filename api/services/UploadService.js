'use strict';

/**
 *
 * @type {{upload: (function(*))}}
 */

const sharp = require('sharp');
const fs = require('fs');
const aws = require('aws-sdk');
aws.config.update({
  accessKeyId: sails.config.s3.key,
  secretAccessKey: sails.config.s3.secret
});
aws.config.region = sails.config.s3.region;
module.exports = {
  /**
   * Upload file
   * @param {string} options
   *    {object}    req       : request object
   *    {inputName} inputName : name of input contain your files
   *    {object}    config    : upload config
   * See more: http://sailsjs.com/documentation/concepts/file-uploads/uploading-to-s-3
   */
  upload: options => {
    const config = {
      maxBytes: 2097152,
      allowedTypes: ['image/jpeg', 'image/png', 'image/gif']
    };
    let { req, inputName } = options;
    function s3Send(s3) {
      return new Promise((resolve, reject) => {
        s3.send((err, data) => {
          if (err) reject(err);
          else resolve(data);
        });
      });
    }
    return new Promise((resolve, reject) => {
      req.file(inputName).upload(config, async function(err, filesUploaded) {
        if (err || _.isEmpty(filesUploaded)) {
          reject(inputName + ' is required');
        } else {
          sails.log(filesUploaded);
          let Images = [];
          if (filesUploaded.length > 0) {
            for (let i = 0; i < filesUploaded.length; i++) {
              if (config.allowedTypes.indexOf(filesUploaded[i].type) === -1)
                reject(inputName + " don't must extention");
              if (filesUploaded[i].size > config.maxBytes)
                reject(inputName + ' max size');
              let dataImage = {};
              const img = sharp(filesUploaded[i].fd);
              let metadata = await img.metadata();
              let bufferThumb = await img.embed().toBuffer();
              let s3obj = new aws.S3({
                params: {
                  Bucket: sails.config.s3.bucket,
                  Key:
                    'images/origin/' +
                    new Date().getTime() +
                    '_' +
                    filesUploaded[i].filename,
                  ACL: 'public-read'
                }
              });
              let s3 = await s3obj.upload({ Body: bufferThumb });
              let dataSend = await s3Send(s3);
              dataImage.origin = dataSend.Location;
              bufferThumb = await img
                .resize(200)
                .embed()
                .toBuffer();
              s3obj = new aws.S3({
                params: {
                  Bucket: sails.config.s3.bucket,
                  Key:
                    'images/thumbnails/thumbnail_' +
                    new Date().getTime() +
                    '_' +
                    filesUploaded[i].filename,
                  ACL: 'public-read'
                }
              });
              s3 = await s3obj.upload({ Body: bufferThumb });
              dataSend = await s3Send(s3);
              dataImage.thumb = dataSend.Location;
              console.log(dataImage);
              Images.push(dataImage);
              fs.unlink(filesUploaded[i].fd);
            }
          }
          resolve(Images);
        }
      });
    });
  }
};
