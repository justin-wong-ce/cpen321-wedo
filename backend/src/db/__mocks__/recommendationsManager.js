/* global jest */
var recManager = {
    updatePreferences: jest.fn((userID, points, taskID, callback) => { }),
    sortTasks: jest.fn((tasks, userID, callback) => { }),
    getPreferences: jest.fn((userID, callback) => { })
};
module.exports = recManager;