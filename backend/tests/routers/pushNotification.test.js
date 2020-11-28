/* global jest */
jest.mock("firebase-admin");
const pushNotification = require("../../src/routers/pushNotification");

it("Test push notification", (done) => {
    pushNotification("the title", "the body", ["token0", "token1"]);
    done();
});

it("Test push notification bad token", (done) => {
    pushNotification("the title", "the body", []);
    done();
});