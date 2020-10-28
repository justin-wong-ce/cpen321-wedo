const express = require('express')
const router = new express.Router()
var admin = require('firebase-admin')
var tempToken;

admin.initializeApp({
  credential: admin.credential.applicationDefault()
});


// var message = {
//   data: {
//     score: '850',
//     time: '2:45'
//   },
//   token: ''
// };

var message = {
  notification: {
    title: 'You received message from ADMIN',
    body: 'ADMIN: Have a nice day!'
  },
  android: {
    notification: {
      icon: 'stock_ticker_update',
      color: '#7e55c3'
    }
  },
  //   topic: "hello",
  token: ''
};

router.post('/pushnotification', async (req, res) => {
  // message.token = req.header('Authorization').replace('Bearer ', '')
  console.log(req.body.token)
  message.token = req.body.token
  tempToken = req.body.token
  console.log(req.body.token)
  admin.messaging().send(message)
    .then((response) => {
      // Response is a message ID string.
      console.log('Successfully sent message:', response);
      res.send('already sent')
    })
    .catch((error) => {
      console.log('Error sending message:', error);
    });
})


router.post('/sendnotification', async (req, res) => {
  message = req.body
  message.token = tempToken
  console.log(tempToken)
  admin.messaging().send(message)
    .then((response) => {
      console.log('sent message: ', response);
      res.send('already sent')
    })
    .catch((error) => {
      console.log('Error sending message:', error);
    });
})


module.exports = router 