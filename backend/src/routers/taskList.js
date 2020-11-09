const express = require("express");
const router = new express.Router();
const taskListFunctions = require("../db/taskLists_db");
const routerHelper = require("./routerHelper");

// Get all tasks (and its information) inside a task list
router.get("/tasklist/get/:userID/:taskListID", (req, res) => {

    console.log("getting tasks from tasklist");

    const userID = req.params.userID;
    const taskListID = req.params.taskListID;

    console.log("getting all tasks for user with ID: " + userID + "from tasklist with ID: " + taskListID);

    if (typeof userID !== "string" ||
        typeof taskListID !== "string") {
        res.status(400).send("bad data format or type");
    }
    else {

        taskListFunctions.getTasksInList(taskListID, userID, (err, results, perms) => {
            if (!perms)
                res.status(401).send("user does not have permissions");
            else {
                routerHelper.callbackHandler(err, results);
            }
        });
    }
})

// Save created task list onto database
router.post("/tasklist/create", (req, res) => {

    console.log("creating task list");

    const newTaskList = req.body;

    if (typeof newTaskList.userID !== "string" ||
        typeof newTaskList.taskListID !== "string" ||
        typeof newTaskList.taskListName !== "string" ||
        typeof newTaskList.createdTime !== "string" ||
        (typeof newTaskList.modifiedTime !== "string" && newTaskList.modifiedTime != null) ||
        (typeof newTaskList.taskListDescription !== "string" && newTaskList.taskListDescription != null)) {
        {
            res.status(400).send("bad data format or type");
        }
    }
    else {
        taskListFunctions.createTaskList(newTaskList, (err, results) => {
            routerHelper.callbackHandler(err, results);
        });
    }
})

// Update a task list
router.put("/tasklist/update", (req, res) => {

    console.log("updating tasklist");

    const taskList = req.body;

    if (typeof taskList.userID !== "string" ||
        typeof taskList.taskListID !== "string" ||
        typeof taskList.modifiedTime !== "string" ||
        (typeof taskList.taskListName !== "string" && taskList.taskListName != null) ||
        (typeof taskList.newOwner !== "string" && taskList.newOwner != null)) {
        res.status(400).send("bad data format or type");
    }
    else {
        taskListFunctions.updateTaskList(taskList, (err, results, perms) => {
            if (!perms)
                res.status(401).send("user does not have permissions");
            else {
                routerHelper.callbackHandler(err, results);
            }
        })
    }

})

// Grant a user access to the task list + push notifications to users with access
router.post("/tasklist/adduser", (req, res) => {

    console.log("adding user to task list");

    const entry = req.body;

    if (typeof entry.userID !== "string" ||
        typeof entry.taskListID !== "string" ||
        typeof entry.addUser !== "string") {
        res.status(400).send("bad data format or type");
    }
    else {
        taskListFunctions.addUser(entry.userID, entry.taskListID, entry.addUser, (err, results, perms) => {
            if (!perms)
                res.status(401).send("user does not have permissions");
            else {
                routerHelper.callbackHandler(err, results);
            }
        })
    }
})

// Remove a user"s access to the task list + push notifications to user with access
router.delete("tasklist/removeuser", (req, res) => {

    console.log("removing user from task list");

    const entry = req.body;

    if (typeof entry.userID !== "string" ||
        typeof entry.taskListID !== "string" ||
        typeof entry.toKick !== "string") {
        res.status(400).send("bad data format or type");
    }
    else {
        taskListFunctions.removeUser(entry.userID, entry.taskListID, entry.toKick, (err, results, perms) => {
            if (!perms)
                res.status(401).send("user does not have permissions");
            else {
                routerHelper.callbackHandler(err, results);
            }
        })
    }
})

// Delete task list and sends push notification to all users with access
router.delete("tasklist/delete", (req, res) => {

    console.log("deleting task list");

    const userID = req.body.userID;
    const taskListID = req.body.taskListID;

    if (typeof userID !== "string" ||
        typeof taskListID !== "string") {
        res.status(401).send("bad data format or type");
    }
    else {
        taskListFunctions.deleteTaskList(userID, taskListID, (err, results, perms) => {
            if (!perms)
                res.status(401).send("user does not have permissions");
            else {
                routerHelper.callbackHandler(err, results);
            }
        })
    }
})

module.exports = router;

