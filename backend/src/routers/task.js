const express = require("express");
const router = new express.Router();
const taskFunctions = require("../db/tasks_db");
const routerHelper = require("./routerHelper");

// Save created task onto database
//
// Body JSON attribute types
// typeof body.userID == "string"
// typeof body.taskListID == "string"
// typeof body.taskName == "string"
// typeof body.taskType == "string"
// typeof body.createdTime == "string"
//
// Optional attributes: ***************************************************
// typeof body.taskDescription == "string"
// typeof body.budget == "number"
// typeof body.address == "string"
// typeof body.priorityLevel == "number"
// typeof body.modifiedTime == "string"
router.post("/task/create", (req, res) => {
    const task = req.body;

    taskFunctions.createTask(task, (err, results, perms) => {
        if (!perms) {
            res.status(401).send("user does not have permissions");
        }
        routerHelper.callbackHandler(err, results);
    });
});

// Update task
//
// Body JSON attribute types
// typeof body.userID == "string"
// typeof body.taskID == "string"
// typeof body.taskListID == "string"
// typeof body.taskName == "string"
// typeof body.taskType == "string"
// typeof body.createdTime == "string"
//
// Optional attributes: ***************************************************
// typeof body.taskDescription == "string"
// typeof body.assignedTo == "string"
// typeof body.budget == "number"
// typeof body.address == "string"
// typeof body.priorityLevel == "number"
// typeof body.modifiedTime == "string"
router.put("/task/update", (req, res) => {
    const task = req.body;

    taskFunctions.createTask(task, (err, results, perms) => {
        if (!perms) {
            res.status(401).send("user does not have permissions");
        }
        routerHelper.callbackHandler(err, results);
    });
});

// Delete task
//
// Body JSON attribute types
// typeof body.userID == "string"
// typeof body.taskID == "string"
// typeof body.taskListID == "string"
router.delete("/task/delete", (req, res) => {
    const taskID = req.body.taskID;
    const userID = req.body.userID;
    const taskListID = req.body.taskListID;

    taskFunctions.deleteTask(taskID, userID, taskListID, (err, results, perms) => {
        if (!perms) {
            res.status(401).send("user does not have permissions");
        }
        routerHelper.callbackHandler(err, results);
    });

});

module.exports = router;