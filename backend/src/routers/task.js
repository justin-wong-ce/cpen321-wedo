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
// typeof body.taskBudget == "number"
// typeof body.address == "string"
// typeof body.priorityLevel == "number"
// typeof body.modifiedTime == "string"
router.post("/task/create", (req, res) => {
    const task = req.body;
    taskFunctions.createTask(task, (err, results, perms) => {
        routerHelper.permHandler(err, results, perms, res);
    });
});

// Update task
//
// Body JSON attribute types
// typeof body.userID == "string"
// typeof body.taskID == "string"
// typeof body.taskListID == "string"
//
// Optional attributes: **************************************************
// typeof body.taskName == "string"
// typeof body.taskType == "string"
// typeof body.taskDescription == "string"
// typeof body.assignedTo == "string"
// typeof body.budget == "number"
// typeof body.address == "string"
// typeof body.priorityLevel == "number"
// typeof body.modifiedTime == "string"
// typeof body.done == "boolean"
// typeof body.taskRating == "number" (IMPORTANT: THIS MUST BE DEFINED IF DONE IS DEFINED)
router.put("/task/update", (req, res) => {
    const task = req.body;
    taskFunctions.updateTask(task, (err, results, perms) => {
        routerHelper.permHandler(err, results, perms, res);
    });
});

// Delete task
//
// Body JSON attribute types
// typeof body.userID == "string"
// typeof body.taskID == "string"
// typeof body.taskListID == "string"
router.delete("/task/delete/:userID/:taskID/:taskListID", (req, res) => {
    const taskID = req.params.taskID.substring(1, req.params.taskID.length - 1);
    const userID = req.params.userID.substring(1, req.params.userID.length - 1);
    const taskListID = req.params.taskListID.substring(1, req.params.taskListID.length - 1);
    taskFunctions.deleteTask(taskID, userID, taskListID, (err, results, perms) => {
        routerHelper.permHandler(err, results, perms, res);
    });

});

module.exports = router;