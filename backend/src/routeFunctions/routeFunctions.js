const { Client } = require("@googlemaps/google-maps-services-js");
var APIKEY = "AIzaSyBrb9k24pVXs1LP1gTO-jP8xOddObkvqpA";
const client = new Client({});

// Helper function to generate permutations
function permutate(list) {
    var res = [];
    var recurseList = [];
    function permuteRecurse(subList, recurseList) {
        var cur = recurseList;

        for (let iter = 0; iter < subList.length; iter++) {
            cur = subList.splice(iter, 1);
            if (subList.length === 0) {
                res.push(recurseList.concat(cur));
            }
            permuteRecurse(subList.slice(), recurseList.concat(cur));
            subList.splice(iter, 0, cur[0]);
        }
        return res;
    }
    return permuteRecurse(list, recurseList);
}

// Converts LatLng object to a string for query
function toUrlValue(latLngObj) {
    return latLngObj.lat.toString() + "," + latLngObj.lng.toString();
}

// Returns a route with locations converted to waypoints
async function route(inputLocs, travelMode) {

    var locations = inputLocs;

    if (locations.length > 2) {
        // Make Google optimize the waypoints
        var waypoints = ["optimize:true"];
        for (let iter = 1; iter < locations.length - 1; iter++) {
            waypoints.push(locations[parseInt(iter, 10)]);
        }
        return client.directions({
            params: {
                origin: locations[0],
                destination: locations[locations.length - 1],
                waypoints,
                mode: travelMode,
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
                mode: travelMode,
                key: APIKEY,
            },
            timeout: 2000,
        });
    }
}

// Call APIs again and with optimized path
// Call with walking and transit interleaved: one would not take transit until all nearby
// locations are reached.
async function makeFinalCalls(closeByGroups, transitRoutes) {

    let transitRouteIter = 0;
    var results = [];

    for (let closeGroup of closeByGroups) {
        // Create waypoints list for close by coordinates
        if (closeGroup.length !== 0) {
            let response = await route(closeGroup, "walking");
            results.push(response.data.routes[0]);
        }

        // Calls API for transit to reach second group of close by coordinates
        if (transitRouteIter < transitRoutes.length) {

            let transitPoint = [toUrlValue(transitRoutes[parseInt(transitRouteIter, 10)].routes[0].legs[0].start_location),
            toUrlValue(transitRoutes[parseInt(transitRouteIter, 10)].routes[0].legs[0].end_location)];

            let response = await route(transitPoint, "transit");
            results.push(response.data.routes[0]);
            transitRouteIter++;
        }
    }
    return results;
}

function closeFarSeparator(route, currCloseBy, closeByGroups, farApartCoor, iter) {
    if (currCloseBy.length !== 0) {
        currCloseBy.push(route.legs[parseInt(iter, 10)].start_location);
    }
    closeByGroups.push(currCloseBy);
    currCloseBy = [];

    // Make sure starting coordinates are added
    if (farApartCoor.length === 0) {
        farApartCoor.push(route.legs[parseInt(iter, 10)].start_location);
    }
    farApartCoor.push(route.legs[parseInt(iter, 10)].end_location);
}

// Groups coordinates that are closer than walkDistanceThreshold into an array
// Returns nothing: arrays should be initialized and values are to be loaded
// directly into the given arrays
function groupByDistance(farApartCoor, closeByGroups, route, walkDistanceThreshold) {
    var currCloseBy = [];

    // Get far apart locations and groups of close-by locations
    for (let legIter = 0; legIter < route.legs.length; legIter++) {
        if (route.legs[parseInt(legIter, 10)].distance.value > walkDistanceThreshold) {

            closeFarSeparator(route, currCloseBy, closeByGroups, farApartCoor, legIter);
        }
        else {
            currCloseBy.push(route.legs[parseInt(legIter, 10)].start_location);
            // Make sure to add final destination to group
            if (legIter === route.legs.length - 1) {
                currCloseBy.push(route.legs[parseInt(legIter, 10)].end_location);
                closeByGroups.push(currCloseBy);
            }
        }
    }
}

async function setUpMaps(locationGraph, responsesMap, locations) {
    for (let locIter0 = 0; locIter0 < locations.length - 1; locIter0++) {
        var neighbours = new Map();

        for (let locIter1 = 1; locIter1 < locations.length; locIter1++) {
            if (locIter1 !== locIter0) {
                var response = await route([locations[parseInt(locIter0, 10)], locations[parseInt(locIter1, 10)]], "transit");

                // can make entire inner for loop asynchronously later on
                neighbours.set(locIter1.toString(), response.data.routes[0].legs[0].distance.value);
                responsesMap.set(locIter0.toString() + locIter1.toString(), response.data);
            }
        }
        locationGraph.set(locIter0.toString(), neighbours);
    }
}

function tspHelper(currPath, currPerm, locationGraph, responsesMap, endingLoc, primitives) {
    for (let iter = 0; iter < currPerm.length; iter++) {
        // Get weight from map for anything that is not the dummy node
        if (currPerm[parseInt(iter, 10)] !== "-1") {
            primitives.currWeight += locationGraph.get(primitives.currLoc).get(currPerm[parseInt(iter, 10)]);
            currPath.push(responsesMap.get(primitives.currLoc + currPerm[parseInt(iter, 10)]));
        }
        primitives.currLoc = currPerm[parseInt(iter, 10)];
    }
}

function setUpTspLocs(locations, noStartingLocation, startEndLocs) {
    for (let count = 0; count < locations.length; count++) {
        noStartingLocation.push(count.toString());
    }
    startEndLocs.startingLoc = noStartingLocation[0];
    startEndLocs.endingLoc = noStartingLocation[noStartingLocation.length - 1];
    noStartingLocation.push("-1");
    noStartingLocation.shift();

}

function tspIteration(permutations, tspIterResults, startingLoc, endingLoc, locationGraph, responsesMap) {
    let currPerm = permutations[parseInt(tspIterResults.onPermutation, 10)];
    tspIterResults.onPermutation++;

    if (currPerm[currPerm.length - 1] !== "-1" || currPerm[currPerm.length - 2] !== endingLoc) {
        return;
    }

    var currPath = [];
    let currWeight = 0;
    let currLoc = startingLoc;

    let primitives = { currWeight, currLoc };
    tspHelper(currPath, currPerm, locationGraph, responsesMap, endingLoc, primitives);

    currWeight = primitives.currWeight;
    currLoc = primitives.currLoc;

    if (currWeight < tspIterResults.minDistance) {
        tspIterResults.minDistance = currWeight;
        tspIterResults.minPath = currPath;
    }
}

async function getBestTransitRoutes(locations) {
    // Basically a travelling postman problem
    // Using naive approach for now
    // get transit route for every possible combination
    const locationGraph = new Map();
    const responsesMap = new Map();

    // Create map to store the cross product of the 2 lists (and its distance)
    await setUpMaps(locationGraph, responsesMap, locations);

    // Set up waypoints, omits starting and ending location 
    let noStartingLocation = [];
    let startEndLocs = {};
    setUpTspLocs(locations, noStartingLocation, startEndLocs);
    let startingLoc = startEndLocs.startingLoc;
    let endingLoc = startEndLocs.endingLoc;

    // Get array of permuations of locations
    let permutations = permutate(noStartingLocation);

    // Find optimal path (travelling post man problem)
    let tspIterResults = {
        minDistance: Number.MAX_VALUE,
        onPermutation: 0,
        minPath: []
    };

    // Find best path by brute force for now, may change to more optimal algorithm later
    do {
        tspIteration(permutations, tspIterResults, startingLoc, endingLoc, locationGraph, responsesMap);
    } while (tspIterResults.onPermutation < permutations.length);

    return tspIterResults.minPath;
}

// Transforms a list of locations into an array of routes
// The array of routes should be combined to form one big route
async function transitRoute(locations, distanceThreshold) {
    if (locations.length === 2) {
        var result = await route(locations, "transit");
        return [result.data.routes[0]];
    }

    // Get preliminary route in driving route form
    var response = await route(locations, "driving");
    if (response.data.status !== "OK") {
        return [];
    }
    else {
        var farApartCoor = [];
        var closeByGroups = [];
        groupByDistance(farApartCoor, closeByGroups, response.data.routes[0], distanceThreshold);

        // Get best transit path and route
        var transitRoutes = [];
        if (farApartCoor.length !== 0) {
            transitRoutes = await getBestTransitRoutes(farApartCoor);
        }
        var results = await makeFinalCalls(closeByGroups, transitRoutes);
        return results;
    }
}

const routeFunctions = {
    getRoute: route,
    getTransitRoute: transitRoute
};

module.exports = routeFunctions;