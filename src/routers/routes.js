const { Client } = require("@googlemaps/google-maps-services-js");
var APIKEY = "AIzaSyBrb9k24pVXs1LP1gTO-jP8xOddObkvqpA";
const express = require('express')
const router = new express.Router()
const client = new Client({})

// PUT FUNCTIONS INTO SEPARATE FILE AND CALL REQUIRE LATER

router.get('/routes/driving', (req, res) => {
    console.log("Get driving route");
    getDrivingRoute(req.body.locations).then((result) => {
        res.status(200).send([result.routes[0]]);
    }).catch((err) => {
        res.status(400).send(err);
    });
})

router.get('/routes/transit', (req, res) => {
    getTransitRoute(req.body.locations, req.body.distanceThreshold)
        .then((result) => {
            res.status(200).send(result)
        }).catch((err) => {
            res.status(400).send(err);
        })
})

// Returns a driving route with locations converted to waypoints
async function getDrivingRoute(locations) {
    console.log(locations);

    if (locations.length != 2) {
        var waypoints = [];
        for (let iter = 1; iter < req.locations.length - 2; iter++) {
            waypoints.push(req.locations[iter]);
        }
        return client.directions({
            params: {
                origin: locations[0],
                destination: locations[locations.length - 1],
                waypoints: waypoints,
                mode: "driving",
                key: APIKEY,
            },
            timeout: 2000,
        });
    }
    else {
        console.log(locations[0], locations[1], APIKEY);
        return client.directions({
            params: {
                origin: locations[0],
                destination: locations[1],
                mode: "driving",
                key: APIKEY,
            },
            timeout: 2000,
        });
    }
}

// Transforms a list of locations into an array of routes
// The array of routes should be combined to form one big route
async function getTransitRoute(locations, distanceThreshold) {
    if (locations.length == 2) {
        var result = await client.directions({
            params: {
                origin: locations[0],
                destination: locations[1],
                mode: "transit",
                key: APIKEY,
            },
            timeout: 2000,
        });
        return [result.data.routes[0]];
    }

    var response = await getDrivingRoute(locations);
    var farApartCoor = [];
    var closeByGroups = [];
    groupByDistance(farApartCoor, closeByGroups, response.route[0], distanceThreshold);

    // Get transit time needed for each far apart location
    // Return empty array on error (error logged in function already)
    var transitRoutes = await getBestTransitRoutes(farApartCoor);
    let transitRouteIter = 0;

    if (transitRoutes == null) {
        res = null;
        return;
    }
    console.log("transitRoutes:", transitRoutes);

    var results = [];

    // Make array
    for (let closeGroup of closeByGroups) {
        var pointGroup = [];
        if (closeGroup.length > 2) {
            for (let pointIter = 1; pointIter < closeGroup.length - 2; pointIter++) {
                pointGroup.push(closeGroup[pointIter].toUrlValue);
            }
        }
        if (closeGroup.length != 0) {
            let response = await client.directions({
                params: {
                    origin: closeGroup[0].toUrlValue,
                    destination: closeGroup[closeGroup.length - 1].toUrlValue,
                    mode: "walking",
                    waypoints: pointGroup,
                    key: APIKEY,
                },
                timeout: 2000
            });
            results.push(response.data);
        }
        if (transitRouteIter < transitRoutes.length) {
            let response = await client.directions({
                params: {
                    origin: transitRoutes[transitRouteIter].route[0].legs[0].start_location.toUrlValue(),
                    destination: transitRoutes[transitRouteIter].route[0].legs[0].end_location.toUrlValue(),
                    mode: "transit",
                    key: APIKEY,
                },
                timeout: 2000
            });
            results.push(response.data);
            transitRouteIter++;
        }
    }
    return result;
}

function groupByDistance(farApartCoor, closeByGroups, route, walkDistanceThreshold) {
    var currCloseBy = [];
    // Get far apart locations and groups of close-by locations
    for (let legIter = 0; legIter < route.legs.length; legIter++) {
        if (route.legs[legIter].distance.value > walkDistanceThreshold) {
            if (currCloseBy.length != 0)
                currCloseBy.push(route.legs[legIter].start_location);
            // Make deep copy of currCloseBy and store group
            closeByGroups.push([...currCloseBy]);
            currCloseBy = [];

            // Make sure starting coordinates are added
            if (farApartCoor.length == 0) {
                farApartCoor.push(route.legs[legIter].start_location);
            }
            farApartCoor.push(route.legs[legIter].end_location);
        }
        else {
            currCloseBy.push(route.legs[legIter].start_location);

            // Make sure to add final destination to group
            if (legIter == route.length - 1) {
                currCloseBy.push(route.legs[legIter].end_location);
                closeByGroups.push([currCloseBy]);
            }
        }
    }
}


async function getBestTransitRoutes(locations) {
    // Basically a travelling postman problem
    // Using naive approach for now

    // Make array without starting location, with dummy location
    let noStartingLocation = [];
    let startingLoc = locations[0].toString();
    let endingLoc = locations[locations.length - 1].toString();
    for (let locationNumber = 1; locationNumber < locations.length; locationNumber++) {
        noStartingLocation.push(locations[locationNumber].toString());
    }
    // Insert dummy address to achieve custom ending node, instead of returning to starting point
    noStartingLocation.push("DUMMY");

    // Get array of permuations of locations
    let permutations = permutate(noStartingLocation);

    // get transit route for every possible combination
    const locationGraph = new Map();
    const responsesMap = new Map();

    for (let locIter0 = 0; locIter0 < locations.length - 1; locIter0++) {

        var neighbours = new Map();

        for (let locIter1 = 1; locIter1 < locations.length; locIter1++) {
            if (locIter1.toString() === locIter0.toString()) continue;
            var response = await client.directions({
                params: {
                    origin: locations[locIter0].toUrlValue(),
                    destination: locations[locIter1].toUrlValue(),
                    mode: "transit",
                    key: APIKEY,
                },
                timeout: 2000
            });
            // can make entire inner for loop asynchronously later on
            neighbours.set(response.data.routes[0].legs[0].end_location.toString(), response.data.routes[0].legs[0].distance.value);
            responsesMap.set(locations[locIter0].toString() + locations[locIter1].toString(), response.data);
        }
        locationGraph.set(locations[locIter0].toString(), neighbours);
    }

    // Get optimal path
    let minDistance = Number.MAX_VALUE;
    let onPermutation = 0;
    var minPath = [];

    do {
        let currPerm = permutations[onPermutation];
        onPermutation++;
        if (currPerm[currPerm.length - 1] !== "DUMMY" || currPerm[currPerm.length - 2] !== endingLoc) {

            continue;
        }

        var currPath = [];

        let currWeight = 0;
        let currLoc = startingLoc;
        for (let iter = 0; iter < currPerm.length; iter++) {
            if (currPerm[iter] === "DUMMY" && currLoc != endingLoc) {
                currWeight += Number.MAX_VALUE;
            } else if (currPerm[iter] !== "DUMMY") {
                console.log("responsemap", currLoc + currPerm[iter], responsesMap.get(currLoc + currPerm[iter]), responsesMap);

                currWeight += locationGraph.get(currLoc).get(currPerm[iter]);
                currPath.push(responsesMap.get(currLoc + currPerm[iter]));

                console.log("have key", responsesMap.has(currLoc + currPerm[iter]));
                console.log("key:", responsesMap.keys().next().value);
            }

            currLoc = currPerm[iter];
        }

        if (currLoc !== "DUMMY") {
            console.log("should not happen");
            currWeight += locationGraph.get(start_location).get(currLoc);
        }

        if (currWeight < minDistance) {
            minDistance = currWeight;
            minPath = currPath;
        }
    } while (onPermutation < permutations.length)

    return minPath;
}

// Helper function generate permutations of a list of locations
function permutate(list) {
    var res = [];
    var recurseList = [];
    function permuteRecurse(subList, recurseList) {
        var cur, recurseList = recurseList;

        for (var iter = 0; iter < subList.length; iter++) {
            cur = subList.splice(iter, 1);
            if (subList.length == 0) {
                res.push(recurseList.concat(cur));
            }
            permuteRecurse(subList.slice(), recurseList.concat(cur));
            subList.splice(iter, 0, cur[0]);
        }
        return res;
    }
    return permuteRecurse(list, recurseList);
}

module.exports = router