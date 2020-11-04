const express = require('express')
const router = new express.Router()
const routeFunctions = require('../routeFunctions/routeFunctions')

router.post('/routes/transit', (req, res) => {
    console.log("Get transit route");
    routeFunctions.getTransitRoute(req.body.locations, req.body.distanceThreshold)
        .then((result) => {
            if (result.data.status == 'ZERO_RESULTS' || result.data.status == 'NOT_FOUND') {
                res.status(404).send("route not found");
            }
            else {
                res.status(200).send({ "routes": [result.data.routes[0]] });
            }
        })
        .catch((err) => {
            console.log(err);
            res.status(400).send(err.message);
        })
})

router.post('/routes/driving', (req, res) => {
    console.log("Get driving route");

    getAndRespond("driving", res, req);
})

router.post('/routes/walking', (req, res) => {
    console.log("Get walking route");
    getAndRespond("walking", res, req);
})

router.post('/routes/biking', (req, res) => {
    console.log("Get biking route");
    getAndRespond("bicycling", res, req);
})

function getAndRespond(mode, res, req) {
    routeFunctions.getRoute(req.body.locations, mode)
        .then((result) => {
            if (result.data.status == 'ZERO_RESULTS' || result.data.status == 'NOT_FOUND') {
                res.status(404).send("route not found");
            }
            else {
                res.status(200).send({ "routes": [result.data.routes[0]] });
            }
        })
        .catch((err) => {
            console.log(err);
            res.status(400).send(err.message);
        })
}


module.exports = router