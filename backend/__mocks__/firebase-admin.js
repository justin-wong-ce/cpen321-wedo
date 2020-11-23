/* global jest */
const admin = jest.createMockFromModule("firebase-admin");

function messaging() {
    return {
        sendMulticast: async (message) => {
            let msgInfo = {
                title: message.notification.title,
                body: message.notification.body,
                tokens: message.tokens
            };
            if (message.tokens.length === 0) {
                throw Error("bad");
            }
            else {
                return msgInfo;
            }
        }
    };
}
admin.messaging = messaging;
module.exports = admin;