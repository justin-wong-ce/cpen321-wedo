const database = require("./databaseInterface");
const userFunctions = require("./users_db");
const recManager = require("./recommendationsManager");

var taskFunctions = {
    createTask: function (entry, callback) {
        userFunctions.checkPermission(entry.userID, entry.taskListID, (err, results) => {
            if (!results)
                callback(null, null, false);
            else {
                entry.createdBy = entry.userID;
                delete entry.userID;

                // ************************************
                // NEED TO SEND PUSH NOTIFICATION HERE
                // ************************************

                database.insert("TaskHasTaskList", entry, (err, results) => {
                    callback(err, results, true);
                });
            }
        });

    },
    updateTask: function (entry, callback) {
        userFunctions.checkPermission(entry.userID, entry.taskListID, (err, results) => {
            if (!results)
                callback(null, null, false);
            else {
                userID = entry.userID;
                delete entry.userID;

                database.update("TaskHasTaskList", entry, "taskID = " + entry.taskID, (err, results) => {
                    if (err || entry.done !== true)
                        callback(err, results, true);

                    // Increment user's "like" factor to the taskType (by rating) if task is done
                    else {
                        recManager.updatePreferences(userID, entry.taskType, entry.taskRating, (err, results) => {
                            callback(err, results);
                        })
                    }
                });
            }
        });
    },
    deleteTask: function (taskID, userID, taskListID, callback) {
        userFunctions.checkPermission(userID, taskListID, (err, results) => {
            if (!results)
                callback(null, null, false);
            else {
                // ************************************
                // NEED TO SEND PUSH NOTIFICATION HERE
                // ************************************

                database.delete("TaskHasTaskList", "taskID = " + taskID, (err, results) => {
                    callback(err, results, true);
                })
            }
        });
    }

}

module.exports = taskFunctions