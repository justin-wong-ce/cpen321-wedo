const { Client } = require("@googlemaps/google-maps-services-js");
var APIKEY = "AIzaSyBrb9k24pVXs1LP1gTO-jP8xOddObkvqpA";
const client = new Client({});

let test = client.directions({
    params: {
        origin: "ubc,vancouver",
        destination: "oakridge,vancouver",
        waypoints: ["optimize:true", "ikea richmond, vancouver", "gastown, vancouver"],
        mode: "driving",
        key: APIKEY,
    },
    timeout: 2000,
});

test.then((response) => {
    console.log(response.data.routes[0]);
}).catch((error) => {
    console.log(error);
})
