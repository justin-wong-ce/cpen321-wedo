var admin = require("firebase-admin");

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
    },
    tokens: []
};

function pushNotification(title, body, tokens) {
    let message = Object.assign({}, template);
    message.notification.title = title;
    message.notification.body = body;
    message.tokens = tokens;
    return admin.messaging().send(message);
};

// router.post("/pushnotification", async (req, res) => {
//     message.token = req.header("Authorization").replace("Bearer ", "")
//     console.log(req.body.token)
//     message.token = req.body.token
//     tempToken = req.body.token;
//     console.log(tempToken);
//     admin.messaging().send(message)
//         .then((response) => {
//             // Response is a message ID string.
//             console.log("Successfully sent message:", response);
//             res.send("already sent")
//         })
//         .catch((error) => {
//             console.log("Error sending message:", error);
//         });
// });

module.exports = pushNotification;