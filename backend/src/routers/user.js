const express = require("express");
const userFunctions = require("../db/users_db");
const router = new express.Router();
const routerHelper = require("./routerHelper");

// Register new user
//
// Body JSON attribute types
// typeof body.userID == "string"
//
// Optional attributes: ***************************************************
// typeof body.isPremium == "boolean"

router.post("/user/new", (req, res) => {
    const entry = req.body;
    userFunctions.registerUser(entry, (err, results) => {
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

module.exports = router;