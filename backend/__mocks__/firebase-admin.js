const admin = jest.createMockFromModule("firebase-admin");

function messaging() {
    return {
        send: (message) => {
            let msgInfo = {
                title: message.notification.title,
                body: message.notification.body,
                tokens: message.tokens
            };
            return msgInfo;
        }
    };
}
admin.messaging = messaging;
module.exports = admin;