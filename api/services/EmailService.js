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
  sails.config.environment === 'staging'
) {
  sendMail = require('./GmailService');
} else {
  sendMail = require('./SESService');
}

if (!sendMail) sails.log.error('Not Found Email Adapter for EmailService');

module.exports = {
  /**
   * Send Welcome Email when user register success
   * @param {object} createdUser
   * @return {Promise}
   */
  sendWelcomeEmail: createdUser => {
    let options = {
      to: createdUser.email,
      from: 'admin@tokubuy.vn',
      subject: 'Welcome to Tokubuy',
      html: `<h1>Welcome ${createdUser.name} to Tokubuy</h1>`
    };
    return sendMail(options);
  },

  sendVerifyCode: user => {
    let options = {
      to: user.email,
      from: 'admin@tokubuy.vn',
      subject: 'Welcome to Tokubuy',
      html: `<h1>Welcome to Tokubuy</h1> <h2>Here is your verify code: ${
        user.verifyCode
      }</h2>`
    };
    return sendMail(options);
  },

  sendResetPasswordCode: user => {
    let options = {
      to: user.email,
      from: 'admin@tokubuy.vn',
      subject: 'Reset Password - Tokubuy',
      html: `<h1>Reset password</h1> <h2>Here is your reset code: ${
        user.verifyCode
      }</h2>`
    };
    return sendMail(options);
  }
};
