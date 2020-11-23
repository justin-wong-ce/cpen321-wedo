/* global jest */
const routeFunctions = {
    getRoute: jest.fn(async (inputLocs, travelMode) => {
        if (inputLocs === "BADLOCS") {
            let retObj = { data: { status: "ZERO_RESULTS" } };
            return retObj;
        }
        else if (inputLocs === "THROW") {
            throw Error("THROW");
        }
        else {
            let retObj = {
                data: {
                    status: "OK",
                    routes: ["PLACEHOLDER", "PLACEHOLDER"]
                }
            };
            return retObj;
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

module.exports = routeFunctions;