const express = require("express");
const router = new express.Router();
const taskListFunctions = require("../db/taskLists_db");
const routerHelper = require("./routerHelper");

// Get all tasks (and its information) inside a task list
//
// Body JSON attribute types
// typeof body.userID == "string"
// typeof body.taskListID == "string"
router.get("/tasklist/get/:userID/:taskListID", (req, res) => {
    const userID = req.params.userID;
    const taskListID = req.params.taskListID;
    taskListFunctions.getTasksInList(taskListID, userID, (err, results, perms) => {
        routerHelper.permHandler(err, results, perms, res);
    });
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
        routerHelper.callbackHandler(err, results, res);
    });
});

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
// typeof body.taskListDescription == "string"
router.put("/tasklist/update", (req, res) => {
    const taskList = req.body;
    taskListFunctions.updateTaskList(taskList, (err, results, perms) => {
        routerHelper.permHandler(err, results, perms, res);
    });

});

// Grant a user access to the task list + push notifications to users with access
//
// Body JSON attribute types
// typeof entry.userID == "string"
// typeof entry.taskListID == "string"
// typeof entry.addUser == "string"
router.post("/tasklist/adduser", (req, res) => {
    const entry = req.body;
    if (entry.userID === entry.addUser) {
        res.status(406).send({ msg: "cannot add yourself" });
    }
    else {
        taskListFunctions.addUser(entry.userID, entry.taskListID, entry.addUser, (err, results, perms) => {
            routerHelper.permHandler(err, results, perms, res);
        });
    }
});

// Remove a user"s access to the task list + push notifications to user with access
//
// Body JSON attribute types
// typeof entry.userID == "string"
// typeof entry.taskListID == "string"
// typeof entry.toKick == "string"
router.delete("/tasklist/kickuser/:userID/:taskListID/:toKick", (req, res) => {
    const entry = {
        userID: req.params.userID.substring(1, req.params.userID.length - 1),
        taskListID: req.params.taskListID.substring(1, req.params.taskListID.length - 1),
        toKick: req.params.toKick.substring(1, req.params.toKick.length - 1),
    }
    if (entry.userID === entry.toKick) {
        res.status(406).send({ msg: "cannot kick yourself" });
    }
    else {
        taskListFunctions.removeUser(entry.userID, entry.taskListID, entry.toKick, (err, results, perms) => {
            routerHelper.permHandler(err, results, perms, res);
        });
    }
});

// Delete task list and sends push notification to all users with access
//
// Body JSON attribute types
// typeof entry.userID == "string"
// typeof entry.taskListID == "string"
router.delete("/tasklist/delete/:userID/:taskListID", (req, res) => {
    const userID = req.params.userID.substring(1, req.params.userID.length - 1);
    const taskListID = req.params.taskListID.substring(1, req.params.taskListID.length - 1);

    taskListFunctions.deleteTaskList(userID, taskListID, (err, results, perms) => {
        routerHelper.permHandler(err, results, perms, res);
    });
});

module.exports = router;

