const database = require('./databaseInterface')

var userFunctions = {
    updateToken: function (userID, token, callback) {

        database.update("User", "token = " + token, "userID = " + userID, (err, results) => {
            callback(err, results);
        })
    },
    updatePremium: function (userID, premiumStatus, callback) {
        database.update("User", "isPremium = " + premiumStatus, "userID = " + userID, (err, results) => {
            callback(err, results);
        })
    },
    getUserLists: function (userID, callback) {
        database.get('taskListID', 'HasAccess', 'userID = ' + userID, (err, results) => {
            callback(err, results);
        })
    },
    checkPermission: function (userID, taskListID, callback) {
        database.get('taskListID', 'HasAccess', 'userID = ' + userID + ", taskListID = " + taskListID, (err, results) => {
            callback(err, results);
        })
    },
    registerUser: function (entry, callback) {
        database.insert("User", entry, (err, results) => {
            callback(err, results);
        })
    }
}

module.exports = userFunctions