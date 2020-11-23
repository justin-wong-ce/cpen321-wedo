var admin = require("firebase-admin");

admin.initializeApp({
    credential: admin.credential.applicationDefault()
});

var template = {
    notification: {
        title: "title",
        body: "body"
    },
    android: {
        notification: {
            icon: "stock_ticker_update",
            color: "#7e55c3"
        }
    }
};

function pushNotification(title, body, tokens) {
    let message = Object.assign({}, template);
    message.notification.title = title;
    message.notification.body = body;
    message.tokens = tokens;

    admin.messaging().sendMulticast(message)
        .then((res) => {
            return;
        }).catch((err) => {
            return;
        });
}

module.exports = pushNotification;