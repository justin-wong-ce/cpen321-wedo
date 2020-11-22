jest.mock("firebase-admin");
const pushNotification = require("../../src/routers/pushNotification");

it("Test push notification", () => {
    let retVal = pushNotification("the title", "the body", ["token0", "token1"]);
    expect(retVal).toEqual(
        {
            title: "the title",
            body: "the body",
            tokens: ["token0", "token1"]
        });
});