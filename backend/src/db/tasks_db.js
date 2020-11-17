const database = require("./databaseInterface");
const userFunctions = require("./users_db");
const recManager = require("./recommendationsManager");

var taskFunctions = {
    createTask(entry, callback) {
        userFunctions.checkPermission(entry.userID, entry.taskListID, (err, results) => {
            if (results.length === 0) {
                callback(null, null, false);
            }
            // ADD MAX # TASKS PER LIST CHECK HERE
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
    updateTask(entry, callback) {
        userFunctions.checkPermission(entry.userID, entry.taskListID, (err, results) => {
            if (!results) {
                callback(null, null, false);
            }
            else {
                let userID = entry.userID;
                delete entry.userID;

                database.update("TaskHasTaskList", entry, { taskID: entry.taskID }, (err, results) => {
                    // if (err || entry.done !== true) {
                    //     callback(err, results, true);
                    // }
                    // // Increment user's "like" factor to the taskType (by rating) if task is done
                    // else {
                    //     recManager.updatePreferences(userID, entry.taskType, entry.taskRating, (err, results) => {
                    //         callback(err, results);
                    //     });
                    // }

                    callback(err, results, true);
                });
            }
        });
    },
    deleteTask(taskID, userID, taskListID, callback) {
        userFunctions.checkPermission(userID, taskListID, (err, results) => {
            if (!results) {
                callback(null, null, false);
            }
            else {
                // ************************************
                // NEED TO SEND PUSH NOTIFICATION HERE
                // ************************************

                database.delete("TaskHasTaskList", taskID, (err, results) => {
                    callback(err, results, true);
                });
            }
        });
    }

};

module.exports = taskFunctions;