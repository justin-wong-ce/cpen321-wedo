const database = require("./databaseInterface");

var userFunctions = {
    checkPermission(userID, taskListID, callback) {
        database.get("taskListID", "HasAccess", "userID = " + userID + ", taskListID = " + taskListID, (err, results) => {
            callback(err, results);
        });
    },
    isListOwner(userID, taskListID, callback) {
        database.get("taskListID", "taskListWithOwner", "userID = " + userID + ", taskListID = " + taskListID, (err, results) => {
            callback(err, results);
        });
    },
    updateToken(userID, token, callback) {

        database.update("Users", "token = " + token, "userID = " + userID, (err, results) => {
            callback(err, results);
        });
    },
    updatePremium(userID, premiumStatus, callback) {
        database.update("Users", "isPremium = " + premiumStatus, "userID = " + userID, (err, results) => {
            callback(err, results);
        });
    },
    getUserLists(userID, callback) {
        database.get("*", "HasAccess", "userID = " + userID, (err, results) => {
            callback(err, results);
        });
    },
    registerUser(entry, callback) {
        database.insert("Users", entry, (err, results) => {
            callback(err, results);
        });
    }
};

module.exports = userFunctions;