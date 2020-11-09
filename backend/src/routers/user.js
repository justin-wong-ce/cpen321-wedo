const express = require('express');
const userFunctions = require('../db/users_db');
const router = new express.Router();
const routerHelper = require('./routerHelper');
const recManager = require('../db/recommendationsManager');

// Register new user
router.post('/user/new', (req, res) => {
    // TODO:
    const user = req.body;

    if (typeof user.userID !== 'string' ||
        typeof user.token !== 'string' ||
        (user.isPremium !== false && user.isPremium !== true && user.isPremium != null))
        res.status(400).send("bad data format or type");
    else {
        userFunctions.registerUser(user, (err, results) => {
            routerHelper.callbackHandler(err, results);
        })
    }
})

// Update user token, call on app startup
router.put('/user/token', async (req, res) => {
    const userID = req.body.userID;
    const token = req.body.token;

    if (typeof userID !== "string" || typeof token !== "string") {
        res.status(400).send("bad data format or type");
    }
    else {
        userFunctions.updateToken(userID, token, (err, results) => {
            routerHelper.callbackHandler(err, results);
        });
    }
})

// Update user premium status
router.put('/user/premium', async (req, res) => {
    const userID = req.body.userID;
    const isPremium = req.body.isPremium;

    if (typeof userID !== "string" && (isPremium !== false || isPremium !== true)) {
        res.status(400).send("bad data format or type");
    }
    else {
        userFunctions.updatePremium(userID, isPremium, (err, results) => {
            routerHelper.callbackHandler(err, results);
        })
    }
})

// Get taskListIDs of tasklists that the user has access to
router.get('/user/tasklists/:userID', async (req, res) => {
    const userID = req.params.userID;
    if (typeof userID !== "string")
        res.status(400).send("bad data format or type");
    else {
        userFunctions.getUserLists(userID, (err, results) => {
            routerHelper.callbackHandler(err, results);
        })
    }
})

// Bias user preferences (add 10 "points" to type)
router.put('/user/biaspreferences', async (req, res) => {
    const userID = req.body.userID;
    const taskType = req.body.taskType;
    if (typeof userID !== "string" &&
        typeof taskType !== "string")
        res.status(400).send("bad data format or type");
    else {
        recManager.updatePreferences(userID, taskType, 10, (err, results) => {
            routerHelper.callbackHandler(err, results);
        })
    }
})

module.exports = router