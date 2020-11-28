const database = require("./databaseInterface");
const recManager = require("./recommendationsManager");
const userFunctions = require("./users_db");
const pushNotification = require("../routers/pushNotification");
const MAX_USERS_IN_FREE_TASKLIST = 5;

var taskListFunctions = {
    getTasksInList(taskListID, userID, callback) {
        // Remove double quotes at the end
        userID = userID.substring(1, userID.length - 1);
        taskListID = taskListID.substring(1, taskListID.length - 1);

        userFunctions.checkPermission(userID, taskListID, (err, results) => {
            if (results.length === 0) {
                callback(null, null, false);
            }
            else {
                database.get("*", "TaskHasTaskList", { taskListID }, " ORDER BY priorityLevel DESC", (err, results) => {
                    recManager.sortTasks(results, userID, (err, results) => {
                        callback(err, results, true);
                    });
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
                database.insert("HasAccess", { userID: entry.userID, taskListID: entry.taskListID }, (err, results) => callback(err, results));
            }
        });
    },
    updateTaskList(entry, callback) {
        userFunctions.isListOwner(entry.userID, entry.taskListID, (err, results) => {
            if (results.length === 0) {
                callback(null, null, false);
            }
            else {
                if (entry.newOwner != null) {
                    entry.userID = entry.newOwner;
                    delete entry["newOwner"];
                }
                database.update("TaskListWithOwner", entry, { taskListID: entry.taskListID }, (err, results) => {
                    callback(err, results, true);
                });
            }
        });

    },
    deleteTaskList(userID, taskListID, callback) {
        userFunctions.isListOwner(userID, taskListID, (err, results) => {
            if (results.length === 0) {
                callback(null, null, false);
            }
            else {
                // ************************************
                // NEED TO SEND PUSH NOTIFICATION HERE
                // Message: Task list has been deleted
                // To: All users with access to that task list
                // ************************************
                database.get("taskListName", "TaskListWithOwner", { taskListID }, "", (err, nameResponse) => {
                    let taskListName = nameResponse[0].taskListName;
                    userFunctions.getTokensInList(userID, taskListID, (err, tokens) => {
                        if (tokens.length !== 0) {
                            pushNotification("Tasklist deleted!", taskListName + " has been deleted!", tokens);
                        }
                        database.delete("TaskListWithOwner", { taskListID }, (err, results) => {
                            callback(err, results, true);
                        });
                    });

                });
            }
        });
    },
    addUser(userID, taskListID, addUser, callback) {
        userFunctions.isListOwner(userID, taskListID, (err, results) => {
            if (results.length === 0) {
                callback(null, null, false);
            }
            else {
                // ************************************
                // NEED TO SEND PUSH NOTIFICATION HERE
                // Message: You have been added to the task list
                // To: The user added to the task list
                // ************************************
                database.get("isPremium", "Users", { userID }, "", (err, userInfo) => {
                    database.get("COUNT(*)", "HasAccess", { taskListID }, "", (err, retUsers) => {
                        let premiumStatus = userInfo[0].isPremium;
                        let numUsers = retUsers[0]["COUNT(*)"];

                        if (numUsers < MAX_USERS_IN_FREE_TASKLIST || premiumStatus !== 0) {
                            database.insert("HasAccess", { userID: addUser, taskListID }, (err, results) => {
                                database.get("token", "Users", { userID: addUser }, "", (err, tokenResponse) => {
                                    let token = tokenResponse[0].token;
                                    database.get("taskListName", "TaskListWithOwner", { taskListID }, "", (err, listNameResponse) => {
                                        let taskListName = listNameResponse[0].taskListName;
                                        pushNotification("New task list!", "You have been added to the task list " + taskListName + "!", [token]);
                                        callback(err, results, true);
                                    });
                                });
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
    removeUser(userID, taskListID, toKick, callback) {
        userFunctions.isListOwner(userID, taskListID, (err, results) => {
            if (results.length === 0) {
                callback(null, null, false);
            }
            else {
                // ************************************
                // NEED TO SEND PUSH NOTIFICATION HERE
                // Message: You have been removed from the task list
                // To: The user that has been removed
                // ************************************
                database.delete("HasAccess", { userID: toKick, taskListID }, (err, results) => {
                    database.get("token", "Users", { userID: toKick }, "", (err, tokenResponse) => {
                        let token = tokenResponse[0].token;
                        database.get("taskListName", "TaskListWithOwner", { taskListID }, "", (err, listNameResponse) => {
                            let taskListName = listNameResponse[0].taskListName;
                            pushNotification("New task list!", "You have been added to the task list " + taskListName + "!", [token]);
                            callback(err, results, true);
                        });
                    });
                });
            }
        });
    }
};

module.exports = taskListFunctions;