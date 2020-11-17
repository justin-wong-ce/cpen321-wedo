const database = require("./databaseInterface");

var userFunctions = {
    checkPermission(userID, taskListID, callback) {
        database.get("taskListID", "HasAccess", { userID, taskListID }, "", (err, results) => {
            callback(err, results);
        });
    },
    isListOwner(userID, taskListID, callback) {
        database.get("taskListID", "TaskListWithOwner", { userID, taskListID }, "", (err, results) => {
            callback(err, results);
        });
    },
    updateToken(userID, token, callback) {
        database.update("Users", { token }, { userID }, (err, results) => {
            callback(err, results);
        });
    },
    updatePremium(userID, premiumStatus, callback) {
        database.update("Users", { isPremium: premiumStatus }, { userID }, (err, results) => {
            callback(err, results);
        });
    },
    getUserLists(userID, callback) {
        database.getJoin("*", "HasAccess", "TaskListWithOwner", "HasAccess.userID = " + userID + " AND HasAccess.taskListID = TaskListWithOwner.taskListID", (err, results) => {
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