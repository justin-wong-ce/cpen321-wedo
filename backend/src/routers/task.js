const express = require('express');
const router = new express.Router();
const taskFunctions = require('../db/tasks_db');
const routerHelper = require('./routerHelper');

// Save created task onto database
router.post('/task/create', (req, res) => {

    console.log("creating task");

    const task = req.body;

    if (typeof task.userID !== 'string' ||
        typeof task.taskListID !== 'string' ||
        typeof task.taskName !== 'string' ||
        typeof task.taskType !== 'string' ||
        typeof task.createdTime !== 'string' ||
        (typeof task.taskDescription !== 'string' && task.taskDescription != null) ||
        (typeof task.budget !== 'number' && task.budget != null) ||
        (typeof task.address !== 'string' && task.address != null) ||
        (typeof task.priorityLevel !== 'number' && task.priorityLevel != null) ||
        (typeof task.modifiedTime !== 'string' && task.modifiedTime != null))
        res.status(400).send("bad data format or type");
    else {
        taskFunctions.createTask(task, (err, results, perms) => {
            if (!perms)
                res.status(401).send("user does not have permissions");
            routerHelper.callbackHandler(err, results);
        })
    }
})

// Update task
router.put('/task/update', (req, res) => {

    console.log("updating task");

    const task = req.body;

    if (typeof task.userID !== 'string' ||
        typeof task.taskID !== 'string' ||
        typeof task.taskListID !== 'string' ||
        typeof task.taskName !== 'string' ||
        typeof task.taskType !== 'string' ||
        typeof task.createdTime !== 'string' ||
        (typeof task.taskDescription !== 'string' && task.taskDescription != null) ||
        (typeof task.assignedTo !== 'string' && task.assignedTo != null) ||
        (typeof task.budget !== 'number' && task.budget != null) ||
        (typeof task.address !== 'string' && task.address != null) ||
        (typeof task.priorityLevel !== 'number' && task.priorityLevel != null) ||
        (typeof task.modifiedTime !== 'string' && task.modifiedTime != null))
        res.status(400).send("bad data format or type");
    else {
        taskFunctions.createTask(task, (err, results, perms) => {
            if (!perms)
                res.status(401).send("user does not have permissions");
            routerHelper.callbackHandler(err, results);
        });
    }
})

// Delete task
router.delete('/task/delete', (req, res) => {

    console.log("deleting task");

    const taskID = req.body.taskID;
    const userID = req.body.userID;
    const taskListID = req.body.taskListID;

    if (typeof task.userID !== 'string' ||
        typeof task.taskID !== 'string' ||
        typeof task.taskListID !== 'string')
        res.status(400).send("bad data format or type");
    else {
        taskFunctions.deleteTask(taskID, userID, taskListID, (err, results, perms) => {
            if (!perms)
                res.status(401).send("user does not have permissions");
            routerHelper.callbackHandler(err, results);
        });
    }
})

module.exports = router