'use strict';
/**
 * Execute Send mail with SES Amazon
 */

const nodemailer = require('nodemailer');
const sesTransport = require('nodemailer-ses-transport');

/**
 *
 * @param {object} options
 *    {string} to        : email address of receiver
 *    {string} from      : email address of sender < e.g noreply@tokuby.vn >
 *    {string} subject   : title of email
 *    {string} html      : content of email in html format
 * @return {Promise}
 */

module.exports = function(options = {}) {
  return new Promise(function(resolve, reject) {
    let { from, to, subject, html } = options;
    if (!from) throw new Error('SESService - Require options.from property');
    if (!to) throw new Error('SESService - Require options.to property');
    if (!subject)
      throw new Error('SESService - Require options.subject property');
    if (!html) throw new Error('SESService - Require options.html property');

    let transporter = nodemailer.createTransport(
      sesTransport({
        accessKeyId: sails.config.sesService.accessKeyId,
        secretAccessKey: sails.config.sesService.secretAccessKey,
        region: sails.config.sesService.region
      })
    );

    let mailOptions = {
      from: options.from,
      to: options.to,
      subject: options.subject,
      html: options.html
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) return reject(error);
      resolve(info);
    });
  });
};
