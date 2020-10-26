const { Client } = require("@googlemaps/google-maps-services-js");
var APIKEY = "AIzaSyBrb9k24pVXs1LP1gTO-jP8xOddObkvqpA";
const client = new Client({});

client.directions({
    params: {
        origin: "ubc,vancouver",
        destination: "dunbar,vancouver",
        mode: "transit",
        key: APIKEY,
    },
    timeout: 2000,
}).then((response) => {
    console.log(response.data);
}).catch((error) => {
    console.log(error);
})
