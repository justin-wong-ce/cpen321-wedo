const express = require("express");
const router = new express.Router();
const taskListFunctions = require("../db/taskLists_db");
const routerHelper = require("./routerHelper");

// Get all tasks (and its information) inside a task list
router.get("/tasklist/get/:userID/:taskListID", (req, res) => {
    const userID = req.params.userID;
    const taskListID = req.params.taskListID;

    console.log("getting all tasks for user with ID: " + userID + "from tasklist with ID: " + taskListID);

    if (typeof userID !== "string" ||
        typeof taskListID !== "string") {
        res.status(400).send("bad data format or type");
    }
    else {

        taskListFunctions.getTasksInList(taskListID, userID, (err, results, perms) => {
            if (!perms) {
                res.status(401).send("user does not have permissions");
            }
            else {
                routerHelper.callbackHandler(err, results);
            }
        });
    }
});

// Save created task list onto database
//
// Body JSON attribute types
// typeof body.userID == "string"
// typeof body.taskListID == "string"
// typeof body.taskListName == "string"
// typeof body.createdTime == "string"
//
// Optional attributes: ***************************************************
// typeof body.modifiedTime == "string"
// typeof body.taskListDescription == "string"
router.post("/tasklist/create", (req, res) => {
    const newTaskList = req.body;
    taskListFunctions.createTaskList(newTaskList, (err, results) => {
        routerHelper.callbackHandler(err, results);
    });
})

// Update a task list
//
// Body JSON attribute types
// typeof body.userID == "string"
// typeof body.taskListID == "string"
// typeof body.modifiedTime == "string"
//
// Optional attributes: ***************************************************
// typeof body.newOwner == "string"
// typeof body.taskListName == "string"
router.put("/tasklist/update", (req, res) => {
    const taskList = req.body;

    taskListFunctions.updateTaskList(taskList, (err, results, perms) => {
        if (!perms)
            res.status(401).send("user does not have permissions");
        else {
            routerHelper.callbackHandler(err, results);
        }
    });

})

// Grant a user access to the task list + push notifications to users with access
//
// Body JSON attribute types
// typeof entry.userID == "string"
// typeof entry.taskListID == "string"
// typeof entry.addUser == "string"
router.post("/tasklist/adduser", (req, res) => {
    const entry = req.body;

    taskListFunctions.addUser(entry.userID, entry.taskListID, entry.addUser, (err, results, perms) => {
        if (!perms)
            res.status(401).send("user does not have permissions");
        else {
            routerHelper.callbackHandler(err, results);
        }
    });
})

// Remove a user"s access to the task list + push notifications to user with access
//
// Body JSON attribute types
// typeof entry.userID == "string"
// typeof entry.taskListID == "string"
// typeof entry.toKick == "string"
router.delete("tasklist/removeuser", (req, res) => {
    const entry = req.body;

    taskListFunctions.removeUser(entry.userID, entry.taskListID, entry.toKick, (err, results, perms) => {
        if (!perms)
            res.status(401).send("user does not have permissions");
        else {
            routerHelper.callbackHandler(err, results);
        }
    });
})

// Delete task list and sends push notification to all users with access
//
// Body JSON attribute types
// typeof entry.userID == "string"
// typeof entry.taskListID == "string"
router.delete("tasklist/delete", (req, res) => {
    const userID = req.body.userID;
    const taskListID = req.body.taskListID;

    taskListFunctions.deleteTaskList(userID, taskListID, (err, results, perms) => {
        if (!perms)
            res.status(401).send("user does not have permissions");
        else {
            routerHelper.callbackHandler(err, results);
        }
    });
})

module.exports = router;

