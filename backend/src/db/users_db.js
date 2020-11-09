const database = require("./databaseInterface");

var userFunctions = {
    checkPermission: function (userID, taskListID, callback) {
        database.get("taskListID", "HasAccess", "userID = " + userID + ", taskListID = " + taskListID, (err, results) => {
            callback(err, results);
        })
    },
    isListOwner: function (userID, taskListID, callback) {
        database.get("taskListID", "taskListWithOwner", "userID = " + userID + ", taskListID = " + taskListID, (err, results) => {
            callback(err, results);
        })
    },
    updateToken: function (userID, token, callback) {

        database.update("Users", "token = " + token, "userID = " + userID, (err, results) => {
            callback(err, results);
        })
    },
    updatePremium: function (userID, premiumStatus, callback) {
        database.update("Users", "isPremium = " + premiumStatus, "userID = " + userID, (err, results) => {
            callback(err, results);
        })
    },
    getUserLists: function (userID, callback) {
        database.get("*", "HasAccess", "userID = " + userID, (err, results) => {
            callback(err, results);
        })
    },
    registerUser: function (entry, callback) {
        database.insert("Users", entry, (err, results) => {
            callback(err, results);
        })
    }
}

module.exports = userFunctions