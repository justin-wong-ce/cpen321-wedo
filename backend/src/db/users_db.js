const database = require('./databaseInterface')

var userFunctions = {
    updateToken: function (entry, callback) {
        database.update("User", entry, "userID = " + entry.userID.toString(), (err, result) => {
            callback(err, result);
        })
    },
    getUserLists: function (userID, callback) {
        database.get('taskListID', 'HasAccess', 'userID = ' + userID.toString(), (err, lists) => {
            callback(err, lists);
        })
    }
}

module.exports = userFunctions