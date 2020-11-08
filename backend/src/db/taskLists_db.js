const database = require('./databaseInterface');
const recManager = require('./recommendationsManager');
const userFunctions = require('./users_db');

var taskListFunctions = {
    getTasksInList: function (taskListID, userID, callback) {
        userFunctions.checkPermission(userID, taskListID, (err, results) => {
            if (!results)
                callback(null, null, false);
            else {
                database.get('*', 'TaskHasTaskList', 'tasklistID = ' + taskListID + " + ORDER BY priorityLevel DESC", (err, results) => {
                    var list = recManager.sortTasks(results, userID);
                    callback(err, results, true);
                });
            }
        });

    },
    createTaskList: function (entry, callback) {
        database.insert("TaskListWithOwner", entry, (err, results) => {
            if (err)
                callback(err, results);

            else {
                var hasAccessObj = {
                    userID: entry.userID,
                    taskListID: entry.taskListID
                }
                database.insert('HasAccess', hasAccessObj, (err, results) => {
                    callback(err, results);
                });
            }
        });
    },
    updateTaskList: function (entry, callback) {
        userFunctions.isListOwner(entry.userID, entry.taskListID, (err, results) => {
            if (!results)
                callback(null, null, false);
            else {
                if (entry.newOwner != null) {
                    entry.userID = entry.newOwner;
                    delete entry['newOwner'];
                }
                database.update("TaskListWithOwner", entry, "taskListID = " + entry.taskListID, (err, results) => {
                    callback(err, results, true);
                });
            }
        });

    },
    deleteTaskList: function (userID, taskListID, callback) {
        userFunctions.isListOwner(entry.userID, entry.taskListID, (err, results) => {
            if (!results)
                callback(null, null, false);
            else {
                // ************************************
                // NEED TO SEND PUSH NOTIFICATION HERE
                // ************************************

                database.delete("TaskListWithOwner", "taskListID = " + entry.taskListID, (err, results) => {
                    callback(err, results, true);
                });
            }
        });
    },
    addUser: function (userID, taskListID, addUser, callback) {
        userFunctions.isListOwner(entry.userID, entry.taskListID, (err, results) => {
            if (!results)
                callback(null, null, false);
            else {
                // ************************************
                // NEED TO SEND PUSH NOTIFICATION HERE
                // ************************************

                var hasAccessObj = {
                    userID: addUser,
                    taskListID: taskListID
                }
                database.insert('HasAccess', hasAccessObj, (err, results) => {
                    callback(err, results, true);
                })
            }
        });
    },
    removeUser: function (userID, taskListID, toKick, callback) {
        userFunctions.isListOwner(entry.userID, entry.taskListID, (err, results) => {
            if (!results)
                callback(null, null, false);
            else {
                // ************************************
                // NEED TO SEND PUSH NOTIFICATION HERE
                // ************************************


                var hasAccessObj = {
                    userID: toKick,
                    taskListID: taskListID
                }
                database.delete('HasAccess', hasAccessObj, (err, results) => {
                    callback(err, results, true);
                })
            }
        });
    }

}

module.exports = taskListFunctions