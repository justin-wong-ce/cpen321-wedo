const { Client } = require("@googlemaps/google-maps-services-js");
var APIKEY = "AIzaSyBrb9k24pVXs1LP1gTO-jP8xOddObkvqpA";
const express = require('express')
const router = new express.Router()
const client = new Client({})

// PUT FUNCTIONS INTO SEPARATE FILE AND CALL REQUIRE LATER

router.post('/routes/driving', (req, res) => {
    console.log("Get driving route");
    getDrivingRoute(req.body.locations).then((result) => {
        res.status(200).send([result.data.routes[0]]);
    }).catch((err) => {
        res.status(400).send(err);
    });
})


router.post('/routes/transit', (req, res) => {
    console.log("Get transit route");
    getTransitRoute(req.body.locations, req.body.distanceThreshold)
        .then((result) => {
            res.status(200).send(result)
        })
        .catch((err) => {
            console.log(err);
            res.status(400).send(err.message);
        })
})

// Returns a driving route with locations converted to waypoints
async function getDrivingRoute(locations) {
    if (locations.length != 2) {
        var waypoints = ["optimize:true"];
        for (let iter = 1; iter < locations.length - 1; iter++) {
            waypoints.push(locations[iter]);
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

    groupByDistance(farApartCoor, closeByGroups, response.data.routes[0], distanceThreshold);

    // Get transit time needed for each far apart location
    // Return empty array on error (error logged in function already)
    var transitRoutes = await getBestTransitRoutes(farApartCoor);

    let transitRouteIter = 0;

    if (transitRoutes == null) {
        res = null;
        return;
    }

    var results = [];

    // Make array
    for (let closeGroup of closeByGroups) {
        var pointGroup = [];
        if (closeGroup.length > 2) {
            for (let pointIter = 1; pointIter < closeGroup.length - 2; pointIter++) {
                pointGroup.push(toUrlValue(closeGroup[pointIter]));
            }
        }
        if (closeGroup.length != 0) {
            let response = await client.directions({
                params: {
                    origin: toUrlValue(closeGroup[0]),
                    destination: toUrlValue(closeGroup[closeGroup.length - 1]),
                    mode: "walking",
                    waypoints: pointGroup,
                    key: APIKEY,
                },
                timeout: 2000
            });
            results.push(response.data.routes[0]);
        }
        if (transitRouteIter < transitRoutes.length) {

            let response = await client.directions({
                params: {
                    origin: toUrlValue(transitRoutes[transitRouteIter].routes[0].legs[0].start_location),
                    destination: toUrlValue(transitRoutes[transitRouteIter].routes[0].legs[0].end_location),
                    mode: "transit",
                    key: APIKEY,
                },
                timeout: 2000
            });
            results.push(response.data.routes[0]);
            transitRouteIter++;
        }
    }

    return results;
}

function groupByDistance(farApartCoor, closeByGroups, route, walkDistanceThreshold) {
    var currCloseBy = [];

    // Get far apart locations and groups of close-by locations
    for (let legIter = 0; legIter < route.legs.length; legIter++) {
        if (route.legs[legIter].distance.value > walkDistanceThreshold) {
            if (currCloseBy.length != 0)
                currCloseBy.push(route.legs[legIter].start_location);
            // Make deep copy of currCloseBy and store group
            closeByGroups.push(currCloseBy);
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
    // get transit route for every possible combination
    const locationGraph = new Map();
    const responsesMap = new Map();

    let noStartingLocation = [];
    for (let locIter0 = 0; locIter0 < locations.length - 1; locIter0++) {
        var neighbours = new Map();

        for (let locIter1 = 1; locIter1 < locations.length; locIter1++) {
            if (locIter1 == locIter0) continue;
            var response = await client.directions({
                params: {
                    origin: toUrlValue(locations[locIter0]),
                    destination: toUrlValue(locations[locIter1]),
                    mode: "transit",
                    key: APIKEY,
                },
                timeout: 2000
            });

            if (response.data.status !== "OK") throw Error(response.data.status);

            // can make entire inner for loop asynchronously later on
            neighbours.set(locIter1.toString(), response.data.routes[0].legs[0].distance.value);
            responsesMap.set(locIter0.toString() + locIter1.toString(), response.data);
        }
        locationGraph.set(locIter0.toString(), neighbours);
    }
    for (let count = 0; count < locations.length; count++) {
        noStartingLocation.push(count.toString());
    }
    let startingLoc = noStartingLocation[0];
    let endingLoc = noStartingLocation[noStartingLocation.length - 1];
    noStartingLocation.push("-1");
    noStartingLocation.shift();

    // Get array of permuations of locations
    let permutations = permutate(noStartingLocation);

    // Get optimal path
    let minDistance = Number.MAX_VALUE;
    let onPermutation = 0;
    var minPath = [];

    do {
        let currPerm = permutations[onPermutation];
        onPermutation++;
        if (currPerm[currPerm.length - 1] !== "-1" || currPerm[currPerm.length - 2] !== endingLoc) {

            continue;
        }

        var currPath = [];

        let currWeight = 0;
        let currLoc = startingLoc;
        for (let iter = 0; iter < currPerm.length; iter++) {
            if (currPerm[iter] === "-1" && currLoc !== endingLoc) {
                currWeight = Number.MAX_VALUE;
            } else if (currPerm[iter] !== "-1") {
                currWeight += locationGraph.get(currLoc).get(currPerm[iter]);
                currPath.push(responsesMap.get(currLoc + currPerm[iter]));
            }
            currLoc = currPerm[iter];
        }

        if (currLoc !== "-1") {
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

        for (let iter = 0; iter < subList.length; iter++) {
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

function toUrlValue(latLngObj) {
    return latLngObj.lat.toString() + "," + latLngObj.lng.toString();
}

module.exports = router