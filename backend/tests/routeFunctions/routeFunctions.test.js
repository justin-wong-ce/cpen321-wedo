/* global jest */
let routeFunctions = require("../../src/routeFunctions/routeFunctions");
jest.setTimeout(20000);

describe("Route functions tests", () => {
    it("Normal route, route found", () => {
        return routeFunctions.getRoute(["ubc life building, vancouver",
            "ubc bus loop, vancouver",
            "ubc bookstore, vancouver",
            "ubc chemistry building, vancvouer",
            "3033 w42nd avenue, vancouver",
            "landsdowne, vancouver"], "driving")
            .then((res) => {
                expect(res.data.status === "OK").toBe(true);
            });
    });

    it("Normal route, route not found", () => {
        return routeFunctions.getRoute(["vancouver, canada", "tokyo, japan"], "walking")
            .then((res) => {
                expect(res.data.status === "ZERO_RESULTS" || res.data.status === "NOT_FOUND").toBe(true);
            });
    });

    it("Transit route, route found", () => {
        return routeFunctions.getTransitRoute(["ubc life building, vancouver",
            "ubc bus loop, vancouver",
            "ubc bookstore, vancouver",
            "ubc chemistry building, vancvouer",
            "3033 w42nd avenue, vancouver",
            "landsdowne, vancouver"], 500)
            .then((res) => {
                expect(res.length === 0).toBe(false);
            });
    });

    it("Transit route, route found (3 far apart locations)", () => {
        return routeFunctions.getTransitRoute([
            "totem park, ubc, vancouver",
            "3033 w42nd avenue, vancouver",
            "landsdowne, vancouver"], 500)
            .then((res) => {
                expect(res.length === 0).toBe(false);
            });
    });

    it("Transit route, route found (2 locations)", () => {
        return routeFunctions.getTransitRoute([
            "ubc bus loop, vancouver",
            "landsdowne, vancouver"], 1000)
            .then((res) => {
                expect(res.length === 0).toBe(false);
            });
    });

    it("Transit route, route found (large threshold)", () => {
        return routeFunctions.getTransitRoute(["ubc life building, vancouver",
            "ubc bus loop, vancouver",
            "ubc bookstore, vancouver",
            "ubc chemistry building, vancvouer",
            "3033 w42nd avenue, vancouver",
            "landsdowne, vancouver"], 10000)
            .then((res) => {
                expect(res.length === 0).toBe(false);
            });
    });

    it("Transit route, route found (many close coors)", () => {
        return routeFunctions.getTransitRoute(["ubc life building, vancouver",
            "ubc bus loop, vancouver",
            "ubc bookstore, vancouver",
            "ubc chemistry building, vancvouer",
            "3033 w42nd avenue, vancouver",
            "save-on-foods, wesbrook village, vancouver",
            "shoppers drug mart, wesbrook village, vancouver",
            "ubc farm, vancouver",
            "ubc stadium, vancouver"], 10000)
            .then((res) => {
                expect(res.length === 0).toBe(false);
            });
    });

    it("Transit route, route found (little close coors)", () => {
        return routeFunctions.getTransitRoute(["ubc life building, vancouver",
            "ubc bus loop, vancouver",
            "ubc bookstore, vancouver",
            "ubc chemistry building, vancvouer",
            "3033 w42nd avenue, vancouver",
            "save-on-foods, wesbrook village, vancouver",
            "shoppers drug mart, wesbrook village, vancouver",
            "ubc farm, vancouver",
            "ubc stadium, vancouver"], 10)
            .then((res) => {
                expect(res.length === 0).toBe(false);
            });
    });

    it("Transit route, route not found", () => {
        return routeFunctions.getTransitRoute(["vancouver, canada", "arctic, north pole", "tokyo, japan"], 1000)
            .then((res) => {
                expect(res.length === 0).toBe(true);
            });
    });
});

// describe("Test permutations", () => {
//     it("Normal operation", () => {

//     });
// });