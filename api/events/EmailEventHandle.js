'use strict';

/**
 * Event Listener: Handle Email Event
 * [{
 *    eventName: 'model.action',
 *    handler: function(data){}
 * }]
 */

module.exports = [
  {
    eventName: 'account.register.email',
    handler: user => {
      EmailService.sendVerifyCode(user).catch(error => {
        // Todo: write this error to some log file
        sails.log.error(
          'EmailEventHandle - user.register.email - error: ',
          error
        );
      });
    }
  },

  {
    eventName: 'account.register.resendEmail',
    handler: user => {
      EmailService.sendVerifyCode(user)
        .then(() => sails.log.info('ReSent verify code email'))
        .catch(error => {
          // Todo: write this error to some log file
          sails.log.error(
            'EmailEventHandle - account.register.resendEmail - error: ',
            error
          );
        });
    }
  }
];
