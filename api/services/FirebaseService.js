/**
 * Created by thanhtv on 4/10/18.
 */

const firebase = require('firebase-admin');
const request = require('request');

const FirebaseService = {
  send: (data, deviceToken) => {
    request(
      {
        url: 'https://fcm.googleapis.com/fcm/send',
        method: 'POST',
        headers: {
          'Content-Type': ' application/json',
          Authorization: 'key=' + sails.config.firebaseKey
        },
        body: JSON.stringify({
          notification: {
            title: 'Kubera Shop',
            body: data.product.name + '当選おめでとうございます。',
            sound: 'default',
            click_action: 'Message_Category'
          },
          data: data,
          priority: 'high',
          to: deviceToken
        })
      },
      function(error, response, body) {
        if (error) {
          console.log(username);
          console.error(error);
        } else if (response.statusCode >= 400) {
          console.error(
            'HTTP Error: ' +
              response.statusCode +
              ' - ' +
              response.statusMessage
          );
        } else {
          sails.log('Success');
        }
      }
    );
  }
  // sendAndroid: (data, deviceToken) => {
  //     request({
  //         url: 'https://fcm.googleapis.com/fcm/send',
  //         method: 'POST',
  //         headers: {
  //             'Content-Type': ' application/json',
  //             'Authorization': 'key=' + sails.config.firebaseKey
  //         },
  //         body: JSON.stringify({
  //             notification: {
  //                 title: title,
  //                 body: data.product.name+"当選おめでとうございます。",
  //                 sound: "default"
  //             },
  //             data: data,
  //             priority: "high",
  //             to: deviceToken
  //         })
  //     }, function (error, response, body) {
  //         if (error) {
  //             console.log(username);
  //             console.error(error);
  //         } else if (response.statusCode >= 400) {
  //             console.error('HTTP Error: ' + response.statusCode + ' - ' + response.statusMessage);
  //         } else {
  //             sails.log("Success");
  //         }
  //     });
  // }
};

module.exports = FirebaseService;
