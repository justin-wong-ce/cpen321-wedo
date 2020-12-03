/* global jest */
const { app, server } = require("../src/server");
const request = require("supertest");

jest.setTimeout(10000);
jest.disableAutomock();

beforeAll(() => {
    server.listen(3005);
});


describe("Integration test 1: Task and task list operations", () => {
    it("Getting task list without permission", () => {
        return request(app)
            .get("/tasklist/get/'throwAway'/'NO_SUCH_TASKLIST'")
            .then((res) => {
                expect(res.status).toBe(401);
            });
    });

    it("Creating task list, but list already exists", () => {
        return request(app)
            .post("/tasklist/create")
            .send({
                "userID": "IntegrationTester", "taskListID": "integration", "taskListName": "filler"
            })
            .then((res) => {
                expect(res.status).toBe(406);
            });
    });

    it("Updating task list without permission", () => {
        return request(app)
            .put("/tasklist/update")
            .send({
                "userID": "IntegrationTester", "taskListID": "a task list", "taskListName": "filler"
            })
            .then((res) => {
                expect(res.status).toBe(401);
            });
    });

    it("Updating task list with bad input", () => {
        return request(app)
            .put("/tasklist/update")
            .send({
                "userID": "IntegrationTester", "taskListID": "integration", "some field that does not exist": 2234234
            })
            .then((res) => {
                expect(res.status).toBe(400);
            });
    });

    it("User adding himself to list", () => {
        return request(app)
            .post("/tasklist/adduser")
            .send({
                "userID": "IntegrationTester", "taskListID": "integration", "addUser": "IntegrationTester"
            })
            .then((res) => {
                expect(res.status).toBe(406);
            });
    });

    it("User kicking himself from list", () => {
        return request(app)
            .delete("/tasklist/kickuser/'IntegrationTester'/'integration'/'IntegrationTester'")
            .then((res) => {
                expect(res.status).toBe(406);
            });
    });

    it("Deleting task list with no permissions", () => {
        return request(app)
            .delete("/tasklist/delete/'IntegrationTester'/'no permissions'")
            .then((res) => {
                expect(res.status).toBe(401);
            });
    });

    it("User adding someone to list, but does not have permission", () => {
        return request(app)
            .post("/tasklist/adduser")
            .send({
                "userID": "IntegrationTester", "taskListID": "testing", "addUser": "his friend"
            })
            .then((res) => {
                expect(res.status).toBe(401);
            });
    });

    it("User adding someone to list, but does not have premium", () => {
        return request(app)
            .post("/tasklist/adduser")
            .send({
                "userID": "IntegrationTester", "taskListID": "integration", "addUser": "his friend"
            })
            .then((res) => {
                expect(res.status).toBe(401);
            });
    });

    it("User swapping list owner", () => {
        return request(app)
            .put("/tasklist/update")
            .send({
                "userID": "IntegrationTester", "taskListID": "swapping", "newOwner": "throwAway"
            })
            .then((res) => {
                expect(res.status).toBe(200);
                request(app)
                    .put("/tasklist/update")
                    .send({
                        "userID": "throwAway", "taskListID": "swapping", "newOwner": "IntegrationTester"
                    })
                    .then((res) => {
                        expect(res.status).toBe(200);
                    });
            });
    });

    it("User create task without permission", () => {
        return request(app)
            .post("/task/create")
            .send({
                "userID": "IntegrationTester", "taskListID": "no perm"
            })
            .then((res) => {
                expect(res.status).toBe(401);
            });
    });

    it("User create task without premium and cap reached", () => {
        return request(app)
            .post("/task/create")
            .send({
                "userID": "IntegrationTester", "taskListID": "integration", "taskID": "should not matter"
            })
            .then((res) => {
                expect(res.status).toBe(401);
            });
    });

    it("User update task without permission", () => {
        return request(app)
            .put("/task/update")
            .send({
                "userID": "IntegrationTester", "taskListID": "should not matter", "taskID": "should not matter"
            })
            .then((res) => {
                expect(res.status).toBe(401);
            });
    });

    it("User update task but task does not exist", () => {
        return request(app)
            .put("/task/update")
            .send({
                "userID": "IntegrationTester", "taskListID": "integration", "taskID": "does not exist"
            })
            .then((res) => {
                expect(res.status).toBe(404);
            });
    });

    it("User delete task without permission", () => {
        return request(app)
            .delete("/task/delete/'IntegrationTester'/'someotherlist'/'should not matter'")
            .then((res) => {
                expect(res.status).toBe(401);
            });
    });

    it("User completes task", () => {
        return request(app)
            .put("/task/update")
            .send({
                "userID": "IntegrationTester", "taskListID": "integration", "taskID": "integration9", "done": true, "taskRating": 4
            })
            .then((res) => {
                expect(res.status).toBe(200);
                request(app)
                    .put("/task/update")
                    .send({
                        "userID": "IntegrationTester", "taskListID": "integration", "taskID": "integration9", "done": false
                    })
                    .then((res) => {
                        expect(res.status).toBe(200);
                    });
            });
    });

    it("Do operations, no errors", () => {
        return request(app)
            .post("/tasklist/create")
            .send({
                "userID": "IntegrationTester", "taskListName": "My first list", "taskListID": "M9testing", "taskListDescription": "M9testing"
            })
            .then((res) => {
                expect(res.status).toBe(200);
                request(app)
                    .post("/tasklist/adduser")
                    .send({
                        "userID": "IntegrationTester", "taskListID": "M9testing", "addUser": "fill0"
                    })
                    .then((res) => {
                        expect(res.status).toBe(200);
                        request(app)
                            .put("/tasklist/update")
                            .send({
                                "userID": "IntegrationTester", "taskListName": "Groceries", "taskListID": "M9testing", "modifiedTime": "2020-11-01 02:10:23"
                            })
                            .then((res) => {
                                expect(res.status).toBe(200);
                                request(app)
                                    .post("/tasklist/adduser")
                                    .send({
                                        "userID": "IntegrationTester", "taskListID": "M9testing", "addUser": "throwAway"
                                    })
                                    .then((res) => {
                                        expect(res.status).toBe(200);
                                        request(app)
                                            .delete("/tasklist/kickuser/'IntegrationTester'/'M9testing'/'throwAway'")
                                            .then((res) => {
                                                expect(res.status).toBe(200);
                                                request(app)
                                                    .post("/task/create")
                                                    .send({
                                                        "userID": "IntegrationTester", "taskID": "task1", "taskListID": "M9testing", "taskName": "Buy bread", "taskType": "transport", "createdTime": "2020-11-01 02:10:23", "taskDescription": "task for testing", "taskBudget": 123, "address": "Save-on-foods, dunbar, vancouver"
                                                    })
                                                    .then((res) => {
                                                        expect(res.status).toBe(200);
                                                        request(app)
                                                            .put("/task/update")
                                                            .send({
                                                                "userID": "IntegrationTester", "taskID": "task1", "taskListID": "M9testing", "taskName": "Buy milk", "modifiedTime": "2020-11-01 02:10:24"
                                                            })
                                                            .then((res) => {
                                                                expect(res.status).toBe(200);
                                                                request(app)
                                                                    .get("/tasklist/get/'IntegrationTester'/'M9testing'")
                                                                    .then((res) => {
                                                                        expect(res.status).toBe(200);
                                                                        expect(res.body).toStrictEqual(
                                                                            [
                                                                                {
                                                                                    "taskID": "task1", "createdBy": "IntegrationTester", "taskBudget": 123, "taskDescription": "task for testing", "taskType": "transport", "priorityLevel": 0, "address": "Save-on-foods, dunbar, vancouver", "done": null, "assignedTo": null, "taskRating": null, "createdTime": "2020-11-01T02:10:23.000Z", "modifiedTime": "2020-11-01T02:10:24.000Z", "taskName": "Buy milk", "taskListID": "M9testing"
                                                                                }
                                                                            ]
                                                                        );
                                                                        request(app)
                                                                            .delete("/task/delete/'IntegrationTester'/'task1'/'M9testing'")
                                                                            .then((res) => {
                                                                                expect(res.status).toBe(200);
                                                                                request(app)
                                                                                    .delete("/tasklist/delete/'IntegrationTester'/'M9testing'")
                                                                                    .then((res) => {
                                                                                        expect(res.status).toBe(200);
                                                                                    });
                                                                            });
                                                                    });
                                                            });
                                                    });
                                            });
                                    });
                            });
                    });
            });
    });
});

describe("Integration test 2: Getting routes", () => {
    it("Get the transit route", () => {
        return request(app)
            .post("/routes/transit")
            .send({
                locations: ["ubc life building, vancouver", "ubc bus loop, vancouver", "ubc bookstore, vancouver", "ubc chemistry building, vancvouer", "3033 w42nd avenue, vancouver", "landsdowne, vancouver"],
                distanceThreshold: 1000
            })
            .then((res) => {
                expect(res.status).toBe(200);
                expect(res.body.routes.length !== 0).toStrictEqual(true);
            });
    });

    it("Get the transit route, but route not found", () => {
        return request(app)
            .post("/routes/transit")
            .send({
                locations: ["ubc life building, vancouver", "yoyogi, tokyo", "london, england"],
                distanceThreshold: 1000
            })
            .then((res) => {
                expect(res.status).toBe(404);
            });
    });

    it("Get the transit route with 2 points", () => {
        return request(app)
            .post("/routes/transit")
            .send({
                locations: ["ubc life building, vancouver", "west broadway, vancouver"],
                distanceThreshold: 1000
            })
            .then((res) => {
                expect(res.status).toBe(200);
            });
    });

    it("Get the transit route: less walking", () => {
        return request(app)
            .post("/routes/transit")
            .send({
                locations: ["ubc life building, vancouver", "ubc bus loop, vancouver", "ubc bookstore, vancouver", "ubc chemistry building, vancvouer", "3033 w42nd avenue, vancouver", "ubc farm, vancouver", "ubc stadium, vancouver"],
                distanceThreshold: 100
            })
            .then((res) => {
                expect(res.status).toBe(200);
                expect(res.body.routes.length !== 0).toStrictEqual(true);
            });
    });

    it("Get the transit route: lots of walking", () => {
        return request(app)
            .post("/routes/transit")
            .send({
                locations: ["ubc life building, vancouver", "ubc bus loop, vancouver", "ubc bookstore, vancouver", "ubc chemistry building, vancvouer", "3033 w42nd avenue, vancouver", "save-on-foods, wesbrook village, vancouver", "shoppers drug mart, wesbrook village, vancouver", "ubc farm, vancouver", "ubc stadium, vancouver"],
                distanceThreshold: 10000
            })
            .then((res) => {
                expect(res.status).toBe(200);
                expect(res.body.routes.length !== 0).toStrictEqual(true);
            });
    });

    it("Get the driving route", () => {
        return request(app)
            .post("/routes/driving")
            .send({
                locations: ["ubc life building, vancouver", "ubc bus loop, vancouver", "ubc bookstore, vancouver", "ubc chemistry building, vancvouer", "3033 w42nd avenue, vancouver", "landsdowne, vancouver"]
            })
            .then((res) => {
                expect(res.status).toBe(200);
                expect(res.body.routes.length !== 0).toStrictEqual(true);
            });
    });

    it("Get the driving route, but route not found", () => {
        return request(app)
            .post("/routes/driving")
            .send({
                locations: ["ubc life building, vancouver", "yoyogi, tokyo"]
            })
            .then((res) => {
                expect(res.status).toBe(404);
            });
    });

    it("Get the biking route", () => {
        return request(app)
            .post("/routes/biking")
            .send({
                locations: ["ubc life building, vancouver", "ubc bus loop, vancouver", "ubc bookstore, vancouver", "ubc chemistry building, vancvouer", "3033 w42nd avenue, vancouver", "landsdowne, vancouver"]
            })
            .then((res) => {
                expect(res.status).toBe(200);
                expect(res.body.routes.length !== 0).toStrictEqual(true);
            });
    });

    it("Get the biking route, but route not found", () => {
        return request(app)
            .post("/routes/biking")
            .send({
                locations: ["ubc life building, vancouver",
                    "yoyogi, tokyo"]
            })
            .then((res) => {
                expect(res.status).toBe(404);
            });
    });

    it("Get the walking route", () => {
        return request(app)
            .post("/routes/walking")
            .send({
                locations: ["ubc life building, vancouver", "ubc bus loop, vancouver", "ubc bookstore, vancouver", "ubc chemistry building, vancvouer", "3033 w42nd avenue, vancouver", "landsdowne, vancouver"]
            })
            .then((res) => {
                expect(res.status).toBe(200);
                expect(res.body.routes.length !== 0).toStrictEqual(true);
            });
    });

    it("Get the walking route, but route not found", () => {
        return request(app)
            .post("/routes/walking")
            .send({
                locations: ["ubc life building, vancouver",
                    "yoyogi, tokyo"]
            })
            .then((res) => {
                expect(res.status).toBe(404);
            });
    });

    it("Try to get a route, but with different character encoding", () => {
        return request(app)
            .post("/routes/driving")
            .send({
                locations: ["しぶやえきまえ、とうきょう", "代々木、東京"]
            })
            .then((res) => {
                expect(res.status).toBe(200);
            });
    });
});

describe("Integration test 3: User operations", () => {
    it("Register user + grant premium status", () => {
        return request(app)
            .post("/user/new")
            .send({ userID: "m9tester" })
            .then((res) => {
                request(app)
                    .put("/user/premium")
                    .send({ userID: "m9tester", isPremium: true })
                    .then((res) => {
                        expect(res.status).toBe(200);
                        expect(res.body).toStrictEqual({
                            "fieldCount": 0, "affectedRows": 1, "insertId": 0, "serverStatus": 2, "warningCount": 0, "message": "(Rows matched: 1  Changed: 0  Warnings: 0", "protocol41": true, "changedRows": 0
                        });
                    });
            });
    });

    it("Update user token", () => {
        return request(app)
            .put("/user/token")
            .send({ userID: "integrationToken", token: "integrationToken" })
            .then((res) => {
                expect(res.status).toBe(200);
                request(app)
                    .put("/user/token")
                    .send({ userID: "integrationToken", token: "revert" })
                    .then((res) => {
                        expect(res.status).toBe(200);
                    });
            });
    });

    it("Get user lists", () => {
        return request(app)
            .get("/user/tasklists/'IntegrationTester'")
            .then((res) => {
                expect(res.status).toBe(200);
                expect(res.body.length).toBe(2);
            });
    });
});