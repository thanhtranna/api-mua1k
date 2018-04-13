/**
 * Email Service
 * @description Server-side logic for Email handle
 */

/**
 * Switch Email Adapter by environment
 */
let sendMail = null;
if (
  sails.config.environment === 'development' ||
  sails.config.environment === 'staging' ||
  sails.config.environment === 'production'
) {
  sendMail = require('./SESService');
} else {
  sendMail = require('./GmailService');
}

if (!sendMail) sails.log.error('Not Found Email Adapter for EmailService');

module.exports = {
  /**
   * Send Welcome Email when user register success
   * @param {object} createdUser
   * @return {Promise}
   */

  // not use (use Platform)
  sendWelcomeEmail: createdUser => {
    let options = {
      to: createdUser.email,
      from: 'admin@mua1k.vn',
      subject: 'Welcome to Mua1k',
      html: `<h1>Welcome ${createdUser.name} to Mua1k</h1>`
    };
    return sendMail(options);
  },

  // not use (use Platform)
  sendVerifyCode: user => {
    let options = {
      to: user.email,
      from: 'admin@mua1k.vn',
      subject: 'Welcome to Mua1k',
      html: `<h1>Welcome to Mua1k</h1> <h2>Here is your verify code: ${
        user.verifyCode
      }</h2>`
    };
    return sendMail(options);
  },

  // not use (use Platform)
  sendResetPasswordCode: user => {
    let options = {
      to: user.email,
      from: 'admin@mua1k.vn',
      subject: 'Reset Password - Mua1k',
      html: `<h1>Reset password</h1> <h2>Here is your reset code: ${
        user.verifyCode
      }</h2>`
    };
    return sendMail(options);
  },

  // not use (test)
  notifyFindLuckyNumberFail: data => {
    let options = {
      to: 'tranthanh.it.95@gmail.com',
      from: 'admin@mua1k.vn',
      subject: 'FIND LUCKY NUMBER FAILE',
      html: String(JSON.stringify(data))
    };
    return sendMail(options);
  },

  replyContact: data => {
    let options = {
      to: data.email,
      from: 'info@kuberacoin.com',
      subject: `TOKUBUY REPLY - ${data.title}`,
      html: data.content
    };
    return sendMail(options);
  }
};
