const { app, server } = require("../src/server");
const request = require("supertest");
const sampleReturnRoute = require("../samples");

jest.setTimeout(10000);

beforeAll(() => {
    server.listen(3005);
});


describe("Integration test 1: User doing a bunch of task and task list operations", () => {
    it("Do operations", () => {
        return request(app)
            .post("/tasklist/create")
            .send({
                "userID": "IntegrationTester",
                "taskListName": "My first list",
                "taskListID": "M9testing",
                "taskListDescription": "M9testing"
            })
            .then(res => {
                request(app)
                    .put("/tasklist/update")
                    .send({
                        "userID": "IntegrationTester",
                        "taskListName": "Groceries",
                        "taskListID": "M9testing",
                        "modifiedTime": "2020-11-01 02:10:23"
                    })
                    .then(res => {
                        request(app)
                            .post("/tasklist/adduser")
                            .send({
                                "userID": "IntegrationTester",
                                "taskListID": "M9testing",
                                "addUser": "throwAway"
                            })
                            .then(res => {
                                request(app)
                                    .delete("/tasklist/kickuser")
                                    .send({
                                        "userID": "IntegrationTester",
                                        "taskListID": "M9testing",
                                        "toKick": "throwAway"
                                    })
                                    .then(res => {
                                        request(app)
                                            .post("/task/create")
                                            .send({
                                                "userID": "IntegrationTester",
                                                "taskID": "task1",
                                                "taskListID": "M9testing",
                                                "taskName": "Buy bread",
                                                "taskType": "transport",
                                                "createdTime": "2020-11-01 02:10:23",
                                                "taskDescription": "task for testing",
                                                "taskBudget": 123,
                                                "address": "Save-on-foods, dunbar, vancouver"
                                            })
                                            .then(res => {
                                                request(app)
                                                    .put("/task/update")
                                                    .send({
                                                        "userID": "IntegrationTester",
                                                        "taskID": "task1",
                                                        "taskListID": "M9testing",
                                                        "taskName": "Buy milk",
                                                        "modifiedTime": "2020-11-01 02:10:24"
                                                    })
                                                    .then(res => {
                                                        request(app)
                                                            .get("/tasklist/get/'IntegrationTester'/'M9testing'")
                                                            .then(res => {
                                                                expect(res.status).toBe(200);
                                                                expect(res.body).toStrictEqual(
                                                                    [
                                                                        {
                                                                            "taskID": "task1",
                                                                            "createdBy": "IntegrationTester",
                                                                            "taskBudget": 123,
                                                                            "taskDescription": "task for testing",
                                                                            "taskType": "transport",
                                                                            "priorityLevel": 0,
                                                                            "address": "Save-on-foods, dunbar, vancouver",
                                                                            "done": null,
                                                                            "assignedTo": null,
                                                                            "taskRating": null,
                                                                            "createdTime": "2020-11-01T02:10:23.000Z",
                                                                            "modifiedTime": "2020-11-01T02:10:24.000Z",
                                                                            "taskName": "Buy milk",
                                                                            "taskListID": "M9testing"
                                                                        }]
                                                                );
                                                            })
                                                    })
                                            })
                                    })
                            })
                    })
            })
    });
});

describe("Integration test 2: Getting a route", () => {
    it("Get the transit route", () => {
        return request(app)
            .post("/routes/driving")
            .send({
                locations: ["ubc life building, vancouver",
                    "ubc bus loop, vancouver",
                    "ubc bookstore, vancouver",
                    "ubc chemistry building, vancvouer",
                    "3033 w42nd avenue, vancouver",
                    "landsdowne, vancouver"],
                distanceThreshold: 1000
            })
            .then(res => {
                expect(res.status).toBe(200);
                expect(res.body).toStrictEqual(sampleReturnRoute);
            });
    });
});

describe("Integration test 3: Registrating user and premium status", () => {
    it("Register user + grant premium status", () => {
        return request(app)
            .post("/user/new")
            .send({ userID: "m9tester" })
            .then(res => {
                request(app)
                    .putt("/user/premium")
                    .send({ userID: "m9tester", isPremium: true })
                    .then(res => {
                        expect(res.status).toBe(200);
                        expect(res.body).toStrictEqual({
                            "fieldCount": 0,
                            "affectedRows": 1,
                            "insertId": 0,
                            "serverStatus": 2,
                            "warningCount": 0,
                            "message": "(Rows matched: 1  Changed: 1  Warnings: 0",
                            "protocol41": true,
                            "changedRows": 1
                        })
                    })
            })
    });
});