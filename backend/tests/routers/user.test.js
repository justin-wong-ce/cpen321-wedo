/* global jest */
const { app, server } = require("../../src/server");
const request = require("supertest");
const userFunctions = require("../../src/db/users_db");

jest.setTimeout(5000);
jest.mock("../../src/db/databaseInterface");
jest.mock("../../src/routers/pushNotification");
jest.mock("../../src/routers/task.js");
jest.mock("../../src/routers/taskList.js");
jest.mock("../../src/routers/routes.js");
const databaseInterface = require("../../src/db/databaseInterface");

beforeAll(() => {
    server.listen(3001);
});

describe("Create user tests", () => {
    it("Normal operation", () => {
        databaseInterface.insert
            .mockImplementationOnce((table, entry, callback) => {
                callback(null, {
                    "fieldCount": 0, "affectedRows": 1, "insertId": 0, "serverStatus": 2, "warningCount": 0, "message": "", "protocol41": true, "changedRows": 0
                });
            });

        return request(app)
            .post("/user/new")
            .send({ userID: "tester" })
            .then((res) => {
                expect(res.status).toStrictEqual(200);
                expect(res.body).toStrictEqual({
                    "fieldCount": 0, "affectedRows": 1, "insertId": 0, "serverStatus": 2, "warningCount": 0, "message": "", "protocol41": true, "changedRows": 0
                });
            });
    });

    it("Already exists", () => {
        databaseInterface.insert
            .mockImplementationOnce((table, entry, callback) => {
                callback({ code: "ER_DUP_ENTRY" }, null);
            });

        return request(app)
            .post("/user/new")
            .send({ userID: "tester" })
            .then((res) => {
                expect(res.status).toStrictEqual(406);
                expect(res.body).toStrictEqual({ msg: "user/task/tasklist already exists" });
            });
    });

    // Bad data format not possible
});

describe("Update user token tests", () => {
    it("Normal operation", () => {
        databaseInterface.update
            .mockImplementationOnce((table, values, condition, callback) => {
                callback(null, {
                    "fieldCount": 0, "affectedRows": 1, "insertId": 0, "serverStatus": 2, "warningCount": 0, "message": "(Rows matched: 1  Changed: 1  Warnings: 0", "protocol41": true, "changedRows": 1
                });
            });

        return request(app)
            .put("/user/token")
            .send({ userID: "tester", token: "t0k3n" })
            .then((res) => {
                expect(res.status).toStrictEqual(200);
                expect(res.body).toStrictEqual({
                    "fieldCount": 0, "affectedRows": 1, "insertId": 0, "serverStatus": 2, "warningCount": 0, "message": "(Rows matched: 1  Changed: 1  Warnings: 0", "protocol41": true, "changedRows": 1
                });
            });
    });

    it("User does not exist", () => {
        databaseInterface.update
            .mockImplementationOnce((table, values, condition, callback) => {
                callback(null, { affectedRows: 0 });
            });

        return request(app)
            .put("/user/token")
            .send({ userID: "tester", token: "doesNotExist" }).then((res) => {
                expect(res.status).toStrictEqual(404);
                expect(res.body).toEqual({ msg: "entry does not exist" });
            });
    });

    it("Bad data format", () => {
        databaseInterface.update
            .mockImplementationOnce((table, values, condition, callback) => {
                callback({ code: "ER_TRUNCATED_WRONG_VALUE" }, null);
            });

        return request(app)
            .put("/user/token")
            .send({ userID: 12349, token: "BAD DATA" })
            .then((res) => {
                expect(res.status).toStrictEqual(400);
                expect(res.body).toEqual({ msg: "bad data format or type" });
            });
    });
});

describe("Update user premium status tests", () => {
    it("Normal operation", () => {
        databaseInterface.update
            .mockImplementationOnce((table, values, condition, callback) => {
                callback(null, {
                    "fieldCount": 0, "affectedRows": 1, "insertId": 0, "serverStatus": 2, "warningCount": 0, "message": "(Rows matched: 1  Changed: 1  Warnings: 0", "protocol41": true, "changedRows": 1
                });
            });

        return request(app)
            .put("/user/premium")
            .send({ userID: "tester", isPremium: true })
            .then((res) => {
                expect(res.status).toStrictEqual(200);
                expect(res.body).toStrictEqual({
                    "fieldCount": 0, "affectedRows": 1, "insertId": 0, "serverStatus": 2, "warningCount": 0, "message": "(Rows matched: 1  Changed: 1  Warnings: 0", "protocol41": true, "changedRows": 1
                });
            });
    });

    it("User does not exist", () => {
        databaseInterface.update
            .mockImplementationOnce((table, values, condition, callback) => {
                callback(null, { affectedRows: 0 });
            });

        return request(app)
            .put("/user/premium")
            .send({ userID: "tester", isPremium: false })
            .then((res) => {
                expect(res.status).toStrictEqual(404);
                expect(res.body).toEqual({ msg: "entry does not exist" });
            });
    });

    it("Bad data format", () => {
        databaseInterface.update
            .mockImplementationOnce((table, values, condition, callback) => {
                callback({ code: "ER_TRUNCATED_WRONG_VALUE" }, null);
            });

        return request(app)
            .put("/user/premium")
            .send({ userID: 189, token: 123123 })
            .then((res) => {
                expect(res.status).toBe(400);
                expect(res.body).toEqual({ msg: "bad data format or type" });
            });
    });
});

describe("Get user tasklists", () => {
    it("Normal operation", () => {
        databaseInterface.getJoin
            .mockImplementationOnce((attributesToGet, table0, table1, joinCond, callback) => {
                callback(null, [
                    {
                        "userID": "tester", "taskListID": "12322", "taskListName": "CPEN321", "modifiedTime": null, "createdTime": null, "taskListDescription": "test test test"
                    }
                ]);
            });

        return request(app).get("/user/tasklists/'tester'")
            .send("")
            .then((res) => {
                expect(res.status).toStrictEqual(200);
                expect(res.body).toStrictEqual([
                    {
                        "userID": "tester", "taskListID": "12322", "taskListName": "CPEN321", "modifiedTime": null, "createdTime": null, "taskListDescription": "test test test"
                    }
                ]
                );
            });
    });

    it("User does not exist", () => {
        databaseInterface.getJoin
            .mockImplementationOnce((attributesToGet, table0, table1, joinCond, callback) => {
                callback(null, []);
            });

        return request(app).get("/user/tasklists/'tester'")
            .send("")
            .then((res) => {
                expect(res.status).toStrictEqual(404);
                expect(res.body).toEqual({ msg: "entry does not exist" });
            });
    });

    // Bad format not possible
});

describe("Get tokens of users in a task list", () => {
    it("Normal operation", () => {
        databaseInterface.getJoin
            .mockImplementationOnce((attributesToGet, table0, table1, joinCond, callback) => {
                callback(null, [{ token: "test0" }, { token: "test1" }, { token: "test2" }]);
            });
        userFunctions.getTokensInList("filler", "filler", (err, tokens) => {
            expect(tokens).toEqual(["test0", "test1", "test2"]);
        });
    });
});

describe("Check permissions of a user", () => {
    it("Normal operation", () => {
        databaseInterface.get
            .mockImplementationOnce((attributesToGet, table, condition, additional, callback) => {
                callback(null, [{ taskListID: "test0" }]);
            });
        userFunctions.checkPermission("filler", "filler", (err, tokens) => {
            expect(tokens).toEqual([{ taskListID: "test0" }]);
        });
    });
});

describe("Check if user is owner of a list", () => {
    it("Normal operation", () => {
        databaseInterface.get
            .mockImplementationOnce((attributesToGet, table, condition, additional, callback) => {
                callback(null, [{ taskListID: "test0" }]);
            });
        userFunctions.isListOwner("filler", "filler", (err, tokens) => {
            expect(tokens).toEqual([{ taskListID: "test0" }]);
        });
    });
});