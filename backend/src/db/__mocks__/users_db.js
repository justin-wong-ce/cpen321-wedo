/* global jest */
var userFunctions = {
    getTokensInList: jest.fn((userID, taskListID, callback) => { }),
    checkPermission: jest.fn((userID, taskListID, callback) => { }),
    isListOwner: jest.fn((userID, taskListID, callback) => { })
};
module.exports = userFunctions;