import { Client } from "@googlemaps/google-maps-services-js";

function generateRoute(locations) {
    const client = new Client({});

    const waypoints = [];
    for (let iter = 1; iter < locations.length - 2; iter++) {
        waypoints.push(locations[iter]);
    }

    client.directions({
        origin: locations[0],
        destination: locations[locations.length - 1],
        waypoints: waypoints,
        key: "AIzaSyBrb9k24pVXs1LP1gTO-jP8xOddObkvqpA",
    }).then((response) => {
        return response.route[0];
    }).catch((err) => {
        console.log(err.response.data.error_message);
        return null;
    })
}