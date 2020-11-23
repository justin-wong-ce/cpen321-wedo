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
        entry.preferences = JSON.stringify({
            shopping: 0,
            transport: 0,
            setup: 0,
            repair: 0,
            study: 0,
            work: 0,
            fun: 0
        });
        database.insert("Users", entry, (err, results) => {
            callback(err, results);
        });
    },
    getTokensInList(userID, taskListID, callback) {
        database.getJoin("token", "Users", "HasAccess", "Users.userID != '" + userID +
            "' AND Users.userID = HasAccess.userID AND HasAccess.taskListID = '" + taskListID + "'", (err, tokenObjs) => {
                let tokens = [];
                for (let index in tokenObjs) {
                    if (typeof (index) === "string") { tokens.push(tokenObjs[`${index}`].token); }
                }
                callback(err, tokens);
            });
    }
};

module.exports = userFunctions;