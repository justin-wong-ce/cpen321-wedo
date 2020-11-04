const connection = require('./mysql')

var taskFunctions = {
    getUserLists: function (userID, callback) {
        database.get('taskListID', 'HasAccess', 'userID = ' + userID.toString(), (err, results) => {
            callback(err, results);
        })
    },

}

module.exports = taskFunctions