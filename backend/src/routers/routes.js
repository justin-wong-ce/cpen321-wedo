const express = require("express");
const router = new express.Router();
const routeFunctions = require("../routeFunctions/routeFunctions");

function getAndRespond(mode, res, req) {
    routeFunctions.getRoute(req.body.locations, mode)
        .then((result) => {
            if (result.data.status === "ZERO_RESULTS" || result.data.status === "NOT_FOUND") {
                res.status(404).send("route not found");
            }
            else {
                res.status(200).send({ "routes": [result.data.routes[0]] });
            }
        })
        .catch((err) => {
            res.status(400).send(err.message);
        });
}

router.post("/routes/transit", (req, res) => {
    console.log("Get transit route");
    routeFunctions.getTransitRoute(req.body.locations, req.body.distanceThreshold)
        .then((result) => {
            if (result === []) {
                res.status(404).send("route not found");
            }
            else {
                res.status(200).send({ "routes": result });
            }
        })
        .catch((err) => {
            res.status(400).send(err.message);
        });
});

router.post("/routes/driving", (req, res) => {
    getAndRespond("driving", res, req);
});

router.post("/routes/walking", (req, res) => {
    getAndRespond("walking", res, req);
});

router.post("/routes/biking", (req, res) => {
    getAndRespond("bicycling", res, req);
});

module.exports = router;