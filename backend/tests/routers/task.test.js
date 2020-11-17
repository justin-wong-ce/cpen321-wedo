const { app, server } = require("../../src/server");
const request = require("supertest");

jest.setTimeout(5000);
jest.mock("../../src/db/databaseInterface");
const databaseInterface = require("../../src/db/databaseInterface");

beforeAll(() => {
    server.listen(3002);
});

describe("Create task", () => {
    it("Normal operation", () => {
        databaseInterface.get
            .mockImplementationOnce((attributesToGet, table, condition, additional, callback) => {
                callback(null, [{ pad: 1 }]);
            })
        databaseInterface.insert
            .mockImplementationOnce((table, entry, callback) => {
                callback(null, {
                    "fieldCount": 0,
                    "affectedRows": 1,
                    "insertId": 0,
                    "serverStatus": 2,
                    "warningCount": 0,
                    "message": "",
                    "protocol41": true,
                    "changedRows": 0
                });
            });

        return request(app)
            .post('/task/create')
            .send({
                "userID": "tester",
                "taskID": "12322_task1",
                "taskListID": "12322",
                "taskName": "test_task_1",
                "taskType": "transport",
                "createdTime": "2020-11-01 02:10:23",
                "taskDescription": "task for testing",
                "taskBudget": 123,
                "address": "UBC, Vancouver"
            })
            .then(res => {
                expect(res.status).toBe(200);
                expect(res.body).toEqual({
                    "fieldCount": 0,
                    "affectedRows": 1,
                    "insertId": 0,
                    "serverStatus": 2,
                    "warningCount": 0,
                    "message": "",
                    "protocol41": true,
                    "changedRows": 0
                });
            });
    });

    it("No permission", () => {
        databaseInterface.get
            .mockImplementationOnce((attributesToGet, table, condition, additional, callback) => {
                callback(null, []);
            });

        return request(app)
            .post('/task/create')
            .send({
                "userID": "tester",
                "taskID": "12322_task1",
                "taskListID": "12322",
                "taskName": "test_task_1",
                "taskType": "transport",
                "createdTime": "2020-11-01 02:10:23",
                "taskDescription": "task for testing",
                "taskBudget": 123,
                "address": "UBC, Vancouver"
            })
            .then(res => {
                expect(res.status).toBe(401);
                expect(res.body).toEqual({ msg: "user does not have permissions" });
            });
    });

    it("Bad format", () => {
        databaseInterface.get
            .mockImplementationOnce((attributesToGet, table, condition, additional, callback) => {
                callback(null, [{ pad: 1 }]);
            });
        databaseInterface.insert
            .mockImplementationOnce((table, entry, callback) => {
                callback({ code: "ER_TRUNCATED_WRONG_VALUE" }, null);
            });

        return request(app)
            .post('/task/create')
            .send({
                "userID": "tester",
                "taskID": "12322_task1",
                "taskListID": "12322",
                "taskName": "test_task_1",
                "taskType": "transport",
                "createdTime": "2020-11-01 02:10:23",
                "taskDescription": "task for testing",
                "taskBudget": 123,
                "address": "UBC, Vancouver"
            })
            .then(res => {
                expect(res.status).toBe(400);
                expect(res.body).toEqual({ msg: "bad data format or type" });
            });
    });

    it("Already exists", () => {
        databaseInterface.get
            .mockImplementationOnce((attributesToGet, table, condition, additional, callback) => {
                callback(null, [{ pad: 1 }]);
            });
        databaseInterface.insert
            .mockImplementationOnce((table, entry, callback) => {
                callback({ code: "ER_DUP_ENTRY" }, null);
            });

        return request(app)
            .post('/task/create')
            .send({
                "userID": "tester",
                "taskID": "12322_task1",
                "taskListID": "12322",
                "taskName": "test_task_1",
                "taskType": "transport",
                "createdTime": "2020-11-01 02:10:23",
                "taskDescription": "task for testing",
                "taskBudget": 123,
                "address": "UBC, Vancouver"
            })
            .then(res => {
                expect(res.status).toBe(406);
                expect(res.body).toEqual({ msg: "user/task/tasklist already exists" });
            });
    });

    // SHOULD FAIL: NOT IMPLEMENTED YET
    it("Number of tasks limit reached", () => {
        databaseInterface.get
            .mockImplementationOnce((attributesToGet, table, condition, additional, callback) => {
                callback(null, [{ pad: 1 }, { pad: 2 }, { pad: 3 }, { pad: 4 }, { pad: 5 }]);
            });
        databaseInterface.insert
            .mockImplementationOnce((table, entry, callback) => {
                callback({ code: "ER_DUP_ENTRY" }, null);
            });

        return request(app)
            .post('/task/create')
            .send({
                "userID": "tester",
                "taskID": "12322_task1",
                "taskListID": "12322",
                "taskName": "test_task_1",
                "taskType": "transport",
                "createdTime": "2020-11-01 02:10:23",
                "taskDescription": "task for testing",
                "taskBudget": 123,
                "address": "UBC, Vancouver"
            })
            .then(res => {
                expect(res.status).toBe(401);
                expect(res.body).toEqual({ msg: "user/task/tasklist already exists" });
            });
    });

    // "Does not exist" not possible (no perms/does not exist same return value from DB)
});

describe("Update task", () => {
    it("Normal operation", () => {
        databaseInterface.get
            .mockImplementationOnce((attributesToGet, table, condition, additional, callback) => {
                callback(null, [{ pad: 1 }]);
            });
        databaseInterface.update
            .mockImplementationOnce((table, values, condition, callback) => {
                callback(null, {
                    "fieldCount": 0,
                    "affectedRows": 1,
                    "insertId": 0,
                    "serverStatus": 2,
                    "warningCount": 0,
                    "message": "",
                    "protocol41": true,
                    "changedRows": 0
                });
            });

        return request(app)
            .post('/task/update')
            .send({
                "userID": "tester",
                "taskID": "12322_task1",
                "taskListID": "12322",
                "taskName": "test_task_1",
                "taskType": "transport",
                "createdTime": "2020-11-01 02:10:23",
                "taskDescription": "task for testing",
                "taskBudget": 123,
                "address": "UBC, Vancouver"
            })
            .then(res => {
                expect(res.status).toBe(200);
                expect(res.body).toEqual({
                    "fieldCount": 0,
                    "affectedRows": 1,
                    "insertId": 0,
                    "serverStatus": 2,
                    "warningCount": 0,
                    "message": "",
                    "protocol41": true,
                    "changedRows": 0
                });
            });
    });

    it("No permission", () => {
        databaseInterface.get
            .mockImplementationOnce((attributesToGet, table, condition, additional, callback) => {
                callback(null, []);
            });

        return request(app)
            .post('/task/update')
            .send({
                "userID": "tester",
                "taskID": "12322_task1",
                "taskListID": "someOtherTask",
                "taskName": "test_task_1",
                "taskType": "transport",
                "createdTime": "2020-11-01 02:10:23",
                "taskDescription": "task for testing",
                "taskBudget": 123,
                "address": "UBC, Vancouver"
            })
            .then(res => {
                expect(res.status).toBe(401);
                expect(res.body).toEqual({ msg: "user does not have permissions" });
            });
    });

    it("Bad format"), () => {
        databaseInterface.get
            .mockImplementationOnce((attributesToGet, table, condition, additional, callback) => {
                callback(null, [{ pad: 1 }]);
            });
        databaseInterface.update
            .mockImplementationOnce((table, values, condition, callback) => {
                callback({ code: "ER_TRUNCATED_WRONG_VALUE" }, null);
            });

        return request(app)
            .post('/task/update')
            .send({
                "userID": "tester",
                "taskID": "12322_task1",
                "taskListID": "12322",
                "taskName": "test_task_1",
                "taskType": "transport",
                "createdTime": "2020-11-01 02:10:23",
                "taskDescription": "task for testing",
                "taskBudget": 123,
                "address": "UBC, Vancouver"
            })
            .then(res => {
                expect(res.status).toBe(400);
                expect(res.body).toEqual({ msg: "bad data format or type" });
            });
    };

    // "Does not exist" not possible (no perms/does not exist same return value from DB)
});