const database = require("./databaseInterface");
const userFunctions = require("./users_db");
const recManager = require("./recommendationsManager");
const pushNotification = require("../routers/pushNotification");
const FREE_USER_MAX_TASKS = 10;

var taskFunctions = {
    createTask(entry, callback) {
        userFunctions.checkPermission(entry.userID, entry.taskListID, (err, results) => {
            if (results.length === 0) {
                callback(null, null, false);
            }
            else {
                database.get("isPremium", "Users", { userID: entry.userID }, "", (err, premium) => {
                    database.get("COUNT(*)", "TaskHasTaskList", { taskListID: entry.taskListID }, "", (err, retTasks) => {
                        let premiumStatus = premium[0].isPremium;
                        let numTasks = retTasks[0]["COUNT(*)"];
                        if (numTasks < FREE_USER_MAX_TASKS || premiumStatus !== 0) {
                            let userID = entry.userID;
                            entry.createdBy = entry.userID;
                            delete entry.userID;

                            // ************************************
                            // NEED TO SEND PUSH NOTIFICATION HERE
                            // Message: <task> has been added to <tasklist>!
                            // To: All users in task list
                            // ************************************

                            database.insert("TaskHasTaskList", entry, (err, results) => {
                                if (!err) {
                                    userFunctions.getTokensInList(userID, entry.taskListID, (err, tokens) => {
                                        if (tokens.length !== 0) {
                                            pushNotification("Task added!", entry.taskName + " has been added!", tokens);
                                        }
                                        callback(err, results, true);
                                    });
                                }
                                else {
                                    callback(err, results, true);
                                }
                            });
                        }
                        else {
                            callback("get premium", null, false);
                        }
                    });
                });

            }
        });

    },
    updateTask(entry, callback) {
        userFunctions.checkPermission(entry.userID, entry.taskListID, (err, results) => {
            if (results.length === 0) {
                callback(null, null, false);
            }
            else {
                let userID = entry.userID;
                delete entry.userID;

                database.update("TaskHasTaskList", entry, { taskID: entry.taskID }, (err, results) => {
                    if (err || results.affectedRows === 0 || entry.done !== true) {
                        callback(err, results, true);
                    }
                    // Increment user's "like" factor to the taskType (by rating) if task is done
                    else {
                        // ************************************
                        // NEED TO SEND PUSH NOTIFICATION HERE
                        // Message: <task> has been done!
                        // To: All users in task list
                        // ************************************
                        recManager.updatePreferences(userID, entry.taskRating, entry.taskID, (err, results) => {
                            userFunctions.getTokensInList(userID, entry.taskListID, (err, tokens) => {
                                if (tokens.length !== 0) {
                                    pushNotification("Task done!", entry.taskName + " has been done!", tokens);
                                }
                                callback(err, results, true);
                            });
                        });
                    }
                });
            }
        });
    },
    deleteTask(taskID, userID, taskListID, callback) {
        userFunctions.checkPermission(userID, taskListID, (err, results) => {
            if (results.length === 0) {
                callback(null, null, false);
            }
            else {
                // ************************************
                // NEED TO SEND PUSH NOTIFICATION HERE
                // Message: <task> has been removed from <tasklist>!
                // To: All users in task list
                // ************************************
                database.get("taskName", "TaskHasTaskList", { taskID }, "", (err, taskNameResponse) => {
                    let taskName = taskNameResponse[0].taskName;
                    database.delete("TaskHasTaskList", { taskID }, (err, results) => {
                        if (!err && results.affectedRows !== 0) {
                            userFunctions.getTokensInList(userID, taskListID, (err, tokens) => {
                                if (tokens.length !== 0) {
                                    pushNotification("Task deleted!", taskName + " has been deleted!", tokens);
                                }
                                callback(err, results, true);
                            });
                        }
                        else {
                            callback(err, results, true);
                        }
                    });
                });
            }
        });
    }
};

module.exports = taskFunctions;