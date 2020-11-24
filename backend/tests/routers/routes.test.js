/* global jest */
const { app, server } = require("../../src/server");
const request = require("supertest");

jest.setTimeout(5000);
jest.mock("../../src/routeFunctions/routeFunctions");
jest.mock("../../src/routers/pushNotification");
jest.mock("../../src/routers/user.js");
jest.mock("../../src/routers/task.js");
jest.mock("../../src/routers/taskList.js");

beforeAll(() => {
    server.listen(3004);
});

describe("Driving tests", () => {
    it("Normal operation", () => {
        return request(app)
            .post("/routes/driving")
            .send({ locations: "something" })
            .then((res) => {
                expect(res.status).toBe(200);
                expect(res.body).toStrictEqual({ "routes": ["PLACEHOLDER"] });
            });
    });

    it("Route not found", () => {
        return request(app)
            .post("/routes/driving")
            .send({ locations: "BADLOCS" })
            .then((res) => {
                expect(res.status).toBe(404);
                expect(res.body).toStrictEqual({ msg: "route not found" });
            });
    });

    it("Error thrown", () => {
        return request(app)
            .post("/routes/driving")
            .send({ locations: "THROW" })
            .then((res) => {
                expect(res.status).toBe(400);
                expect(res.body).toStrictEqual({ msg: "bad data format" });
            });
    });
});

describe("Walking tests", () => {
    it("Normal operation", () => {
        return request(app)
            .post("/routes/walking")
            .send({ locations: "something" })
            .then((res) => {
                expect(res.status).toBe(200);
                expect(res.body).toStrictEqual({ "routes": ["PLACEHOLDER"] });
            });
    });

    it("Route not found", () => {
        return request(app)
            .post("/routes/walking")
            .send({ locations: "BADLOCS" })
            .then((res) => {
                expect(res.status).toBe(404);
                expect(res.body).toStrictEqual({ msg: "route not found" });
            });
    });

    it("Error thrown", () => {
        return request(app)
            .post("/routes/walking")
            .send({ locations: "THROW" })
            .then((res) => {
                expect(res.status).toBe(400);
                expect(res.body).toStrictEqual({ msg: "bad data format" });
            });
    });
});

describe("Biking tests", () => {
    it("Normal operation", () => {
        return request(app)
            .post("/routes/biking")
            .send({ locations: "something" })
            .then((res) => {
                expect(res.status).toBe(200);
                expect(res.body).toStrictEqual({ "routes": ["PLACEHOLDER"] });
            });
    });

    it("Route not found", () => {
        return request(app)
            .post("/routes/biking")
            .send({ locations: "BADLOCS" })
            .then((res) => {
                expect(res.status).toBe(404);
                expect(res.body).toStrictEqual({ msg: "route not found" });
            });
    });

    it("Error thrown", () => {
        return request(app)
            .post("/routes/biking")
            .send({ locations: "THROW" })
            .then((res) => {
                expect(res.status).toBe(400);
                expect(res.body).toStrictEqual({ msg: "bad data format" });
            });
    });
});

describe("Transit tests", () => {
    it("Normal operation", () => {
        return request(app)
            .post("/routes/transit")
            .send({ locations: "something", distanceThreshold: 100 })
            .then((res) => {
                expect(res.status).toBe(200);
                expect(res.body).toStrictEqual({ "routes": ["PLACEHOLDER", "PLACEHOLDER"] });
            });
    });

    it("Route not found", () => {
        return request(app)
            .post("/routes/transit")
            .send({ locations: "BADLOCS", distanceThreshold: 100 })
            .then((res) => {
                expect(res.status).toBe(404);
                expect(res.body).toStrictEqual({ msg: "route not found" });
            });
    });

    it("Error thrown", () => {
        return request(app)
            .post("/routes/transit")
            .send({ locations: "THROW", distanceThreshold: 100 })
            .then((res) => {
                expect(res.status).toBe(400);
                expect(res.body).toStrictEqual({ msg: "bad data format" });
            });
    });
});