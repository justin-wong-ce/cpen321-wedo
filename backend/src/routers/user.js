const express = require("express");
const userFunctions = require("../db/users_db");
const router = new express.Router();
const routerHelper = require("./routerHelper");
const recManager = require("../db/recommendationsManager");

// Register new user
//
// Body JSON attribute types
// typeof body.userID == "string"
// typeof body.token == "string"
//
// Optional attributes: ***************************************************
// typeof body.isPremium == "boolean"

router.post("/user/new", (req, res) => {
    // TODO:
    const user = req.body;

    userFunctions.registerUser(user, (err, results) => {
        routerHelper.callbackHandler(err, results, res);
    });
});

// Update user token, call on app startup
//
// Body JSON attribute types
// typeof body.userID == "string"
// typeof body.token == "string"
router.put("/user/token", async (req, res) => {
    const userID = req.body.userID;
    const token = req.body.token;

    userFunctions.updateToken(userID, token, (err, results) => {
        routerHelper.callbackHandler(err, results, res);
    });
});

// Update user premium status
//
// Body JSON attribute types
// typeof body.userID == "string"
// typeof body.isPremium == "boolean"
router.put("/user/premium", async (req, res) => {
    const userID = req.body.userID;
    const isPremium = req.body.isPremium;

    userFunctions.updatePremium(userID, isPremium, (err, results) => {
        routerHelper.callbackHandler(err, results, res);
    });
});

// Get taskLists of tasklists that the user has access to
//
// Param types
// typeof body.userID == "string"
router.get("/user/tasklists/:userID", async (req, res) => {
    const userID = req.params.userID;

    userFunctions.getUserLists(userID, (err, results) => {
        routerHelper.callbackHandler(err, results, res);
    });
});

// Bias user preferences (add 10 "points" to type)
//
// Body JSON attribute types
// typeof body.userID == "string"
// typeof body.taskType == "string"
router.put("/user/biaspreferences", async (req, res) => {
    const userID = req.body.userID;
    const taskType = req.body.taskType;
    recManager.updatePreferences(userID, taskType, 10, (err, results) => {
        routerHelper.callbackHandler(err, results, res);
    });
});

module.exports = router;