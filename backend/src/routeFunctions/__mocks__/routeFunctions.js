/* global jest */
const routeFunctions = {
    getRoute: jest.fn(async (inputLocs, travelMode) => {
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
    }),
    getTransitRoute: jest.fn(async (locations, distanceThreshold) => {
        if (locations === "BADLOCS") {
            return [];
        }
        else if (locations === "THROW") {
            throw Error("THROW");
        }
        else {
            return ["PLACEHOLDER", "PLACEHOLDER"];
        }
    })
};

module.exports = routeFunctions