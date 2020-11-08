const database = require('./databaseInterface')

function checkPermission(userID, taskListID, callback) {
    database.get('taskListID', 'HasAccess', 'userID = ' + userID + ", taskListID = " + taskListID, (err, results) => {
        callback(err, results);
    })
};

var taskFunctions = {
    createTask: function (entry, callback) {
        checkPermission(entry.userID, entry.taskListID, (err, results) => {
            if (!results)
                callback(null, null, false);
            else {
                database.insert("TaskHasTaskList", entry, (err, results) => {
                    callback(err, results, true);
                });
            }
        })

    },
    updateTask: function (entry, callback) {
        checkPermission(entry.userID, entry.taskListID, (err, results) => {
            if (!results)
                callback(null, null, false);
            else {
                database.update("TaskHasTaskList", entry, "taskID = " + entry.taskID, (err, results) => {
                    callback(err, results, true);
                });
            }
        });
    },
    deleteTask: function (taskID, userID, taskListID, callback) {
        checkPermission(userID, taskListID, (err, results) => {
            if (!results)
                callback(null, null, false);
            else {
                database.delete("TaskHasTaskList", "taskID = " + taskID, (err, results) => {
                    callback(err, results, true);
                })
            }
        })
    }

}

module.exports = taskFunctions