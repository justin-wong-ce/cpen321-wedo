// JS file for generating a public transit route for given route
import priorityQueue, { PriorityQueue } from './PriorityQueue.js';
const { response } = require("express");

function transformToPublicRoute(route, walkDistanceThreshold, res, err) {
    let farApartCoor = [];
    let closeByGroups = [];
    let currCloseBy = [];
    // Get far apart locations and groups of close-by locations
    for (let legIter = 0; legIter < route.length; legIter++) {

        if (route.legs[legIter] > walkDistanceThreshold && farApartLocations) {
            currCloseBy.push(route.legs[legIter].start_location);
            // Make deep copy of currCloseBy and store group
            closeByGroups.push($.append({}, currCloseBy));
            currCloseBy = [];

            // Make sure starting coordinates are added
            if (farApartCoor.length == 0) {
                farApartLocations.push(route.legs[legIter].start_location);
            }
            farApartLocations.push(route.legs[legIter].end_location);
        }
        else {
            currCloseBy.push(route.legs[legIter].start_location);

            // Make sure to add final destination to group
            if (legIter == route.length - 1) {
                currCloseBy.push(route.legs[legIter].end_location);
                closeByGroups.push($.append({}, currCloseBy));
            }
        }
    }

    // Get transit time needed for each far apart location
    // Return empty array on error (error logged in function already)
    var transitRoutes = [];
    getShortestTransitRoute(farApartCoor, transitRoutes, err);
    let transitRouteIter = 0;

    // Make array
    var resultResponses = [];
    for (let closeGroup of closeByGroups) {
        if (![].equals(closeGroup)) {
            directionsService.route(
                {
                    origin: closeGroup.shift(),
                    destination: closeGroup.pop(),
                    travelMode: google.maps.TravelMode.WALKING,
                },
                (response, status) => {
                    if ("OK".equals(status)) {
                        resultResponses.push(response);
                    } else {
                        console.log("ERROR IN GENERATING ROUTE FOR WALKING: Error was: " + status);
                        res = [];
                        err = status;
                        return;
                    }
                }
            );
        }
        if (transitRouteIter < transitRoutes.length) {
            resultResponses.push(transitRoutes[transitRouteIter]);
            transitRouteIter++;
        }
    }
    res = resultResponses;
}


function getShortestTransitRoute(locations, res, err) {
    // Uses Dijkstra's algorithm to find shortest path
    // Node ID: LatLng type of location, key of locationGraph
    // Node neighbours and edge weight saved in locationGraph value
    const locationGraph = new Map();
    const start_latlng = locations[0];
    const end_latlng = location[locations.length - 1];

    // get transit route for every possible combination
    for (let locIter0 = 0; locIter0 < locations.length - 1; locIter0++) {
        var neighbours = new Set();
        for (let locIter1 = 1; locIter1 < locations.length; locIter1++) {
            if (locIter1 == locIter0) continue;
            directionsService.route(
                {
                    origin: locations[locIter0],
                    destination: locations[locIter1],
                    travelMode: google.maps.TravelMode.TRANSIT,
                    // Can add further transit options later on
                },
                (response, status) => {
                    if ("OK".equals(status)) {
                        neighbours.add({ nodeID: response.routes[0].legs[0].end_location, weight: response.routes[0].legs[0].distance })
                    }
                    else {
                        console.log("ERROR IN GETTING SHORT TRANSIT ROUTE: Error was: " + status);
                        res = [];
                        err = status;
                        return;
                    }
                }
            );
        }
        locationGraph.set(locations[locIter0], { neighbours: neighbours, response: response });
    }

    res = dijkstraAlgo(start_latlng, end_latlng, locationGraph);
}

function dijkstraAlgo(start_latlng, end_latlng, locationGraph) {
    let distance = new Map();
    let backTrace = new Map();
    let priorityQ = new PriorityQueue();

    for (let node of locationGraph.keys()) {
        distance.set(node, Number.MAX_VALUE);
    }
    distance.set(start_latlng, 0);
    priorityQ.enqueue([start_latlng, 0]);

    while (!priorityQ.isEmpty()) {
        let closestNeighbour = priorityQ.dequeue();
        let currNode = closestNeighbour[0];

        for (let neighbour of locationGraph.get(currNode).values().neighbours) {
            let newDistance = distance.get(currNode) + neighbour.weight;
            if (newDistance < distance.get(neighbour.nodeID)) {
                distance.set(neighbour.nodeID, newDistance);
                backTrace.set(neighbour.nodeID, currNode);
                priorityQ.enqueue([neighbour.nodeID, newDistance]);
            }
        }
    }

    let responsePath = [locationGraph.get(end_latlng).values().response];
    let stepBack = end_latlng;
    while (!end_latlng.equals(start_latlng)) {
        responsePath.unshift(locationGraph.get(backTrace.get(stepBack)).values().response);
        stepBack = backTrace.get(stepBack);
    }

    return responsePath;
}

// TESTING ONLY
function initMap() {
    const directionsRenderer = new google.maps.directionsRenderer();
    const directionsService = new google.maps.DirectionsService();
    const map = new google.maps.Map(document.getElementById("map"), {
        zoom: 14,
        center: { lat: 37.77, lng: -122.447 },
    });
    directionsRenderer.setMap(map);


}