const database = require("./databaseInterface");
const recManager = require("./recommendationsManager");
const userFunctions = require("./users_db");

var taskListFunctions = {
    getTasksInList(taskListID, userID, callback) {
        userFunctions.checkPermission(userID, taskListID, (err, results) => {
            if (!results) {
                callback(null, null, false);
            }
            else {
                database.get("*", "TaskHasTaskList", "tasklistID = " + taskListID + " + ORDER BY priorityLevel DESC", (err, results) => {
                    var list = recManager.sortTasks(results, userID);
                    callback(err, results, true);
                });
            }
        });

    },
    createTaskList(entry, callback) {
        database.insert("TaskListWithOwner", entry, (err, results) => {
            if (err) {
                callback(err, results);
            }

            else {
                var hasAccessObj = {
                    userID: entry.userID,
                    taskListID: entry.taskListID
                };
                database.insert("HasAccess", hasAccessObj, (err, results) => {
                    callback(err, results);
                });
            }
        });
    },
    updateTaskList(entry, callback) {
        userFunctions.isListOwner(entry.userID, entry.taskListID, (err, results) => {
            if (!results) {
                callback(null, null, false);
            }
            else {
                if (entry.newOwner != null) {
                    entry.userID = entry.newOwner;
                    delete entry["newOwner"];
                }
                database.update("TaskListWithOwner", entry, "taskListID = " + entry.taskListID, (err, results) => {
                    callback(err, results, true);
                });
            }
        });

    },
    deleteTaskList(userID, taskListID, callback) {
        userFunctions.isListOwner(userID, taskListID, (err, results) => {
            if (!results) {
                callback(null, null, false);
            }
            else {
                // ************************************
                // NEED TO SEND PUSH NOTIFICATION HERE
                // ************************************

                database.delete("TaskListWithOwner", "taskListID = " + taskListID, (err, results) => {
                    callback(err, results, true);
                });
            }
        });
    },
    addUser(userID, taskListID, addUser, callback) {
        userFunctions.isListOwner(entry.userID, entry.taskListID, (err, results) => {
            if (!results) {
                callback(null, null, false);
            }
            else {
                // ************************************
                // NEED TO SEND PUSH NOTIFICATION HERE
                // ************************************

                var hasAccessObj = {
                    userID: addUser,
                    taskListID
                };
                database.insert("HasAccess", hasAccessObj, (err, results) => {
                    callback(err, results, true);
                });
            }
        });
    },
    removeUser(userID, taskListID, toKick, callback) {
        userFunctions.isListOwner(entry.userID, entry.taskListID, (err, results) => {
            if (!results) {
                callback(null, null, false);
            }
            else {
                // ************************************
                // NEED TO SEND PUSH NOTIFICATION HERE
                // ************************************


                var hasAccessObj = {
                    userID: toKick,
                    taskListID
                };
                database.delete("HasAccess", hasAccessObj, (err, results) => {
                    callback(err, results, true);
                });
            }
        });
    }

}

module.exports = taskListFunctions;