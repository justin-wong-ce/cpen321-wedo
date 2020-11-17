const database = jest.createMockFromModule("../routeFunctions");

async function route(inputLocs, travelMode) {
    if (inputLocs === "BADLOCS") {
        return { data: { status: "ZERO_RESULTS" } };
    }
    else if (inputLocs === "THROW") {
        throw Error("THROW");
    }
    else {
        return {
            data: {
                status: "OK",
                routes: ["PLACEHOLDER", "PLACEHOLDER"]
            }
        };
    }
};

async function transitRoute(locations, distanceThreshold) {
    if (locations === "BADLOCS") {
        return [];
    }
    else if (locations === "THROW") {
        throw Error("THROW");
    }
    else {
        return ["PLACEHOLDER", "PLACEHOLDER"];
    }
};

const routeFunctions = {
    getRoute: route,
    getTransitRoute: transitRoute
};

module.exports = routeFunctions