const { app, server } = require("../../src/server");
const request = require("supertest");

jest.setTimeout(5000);
jest.mock("../../src/db/databaseInterface");
const databaseInterface = require("../../src/db/databaseInterface");

beforeAll(() => {
    server.listen(3003);
});

describe("Get tasks in task list", () => {
    it("Normal operation", () => {
        databaseInterface.get
            .mockImplementationOnce((attributesToGet, table, condition, additional, callback) => {
                callback(null, [{ pad: 1 }]);
            })
            .mockImplementationOnce((attributesToGet, table, condition, additional, callback) => {
                callback(null, [
                    {
                        "taskID": "testing_task1",
                        "createdBy": "throwAway",
                        "taskBudget": 123,
                        "taskDescription": "task for testing MODIFIED",
                        "taskType": "transport",
                        "priorityLevel": 0,
                        "address": "UBC, Vancouver",
                        "done": null,
                        "assignedTo": null,
                        "taskRating": null,
                        "createdTime": "2020-11-01T02:10:23.000Z",
                        "modifiedTime": null,
                        "taskName": "test_task_0",
                        "taskListID": "testing"
                    }]);
            });

        return request(app)
            .get("/tasklist/get/'throwAway'/'testing'")
            .then(res => {
                expect(res.status).toBe(200);
                expect(res.body).toEqual([
                    {
                        "taskID": "testing_task1",
                        "createdBy": "throwAway",
                        "taskBudget": 123,
                        "taskDescription": "task for testing MODIFIED",
                        "taskType": "transport",
                        "priorityLevel": 0,
                        "address": "UBC, Vancouver",
                        "done": null,
                        "assignedTo": null,
                        "taskRating": null,
                        "createdTime": "2020-11-01T02:10:23.000Z",
                        "modifiedTime": null,
                        "taskName": "test_task_0",
                        "taskListID": "testing"
                    }]);
            });
    });

    it("No permissions", () => {
        databaseInterface.get
            .mockImplementationOnce((attributesToGet, table, condition, additional, callback) => {
                callback(null, []);
            });

        return request(app)
            .get("/tasklist/get/'throwAway'/'testing'")
            .then(res => {
                expect(res.status).toBe(401);
                expect(res.body).toEqual({ msg: "user does not have permissions" });
            });
    });

    // Bad data format not possible
    // Does not exist not possible
});

describe("Create task list", () => {
    it("Normal operation", () => {
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
            })
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
            .post('/tasklist/create')
            .send({
                "userID": "throwAway",
                "taskListName": "testing tasklist",
                "taskListID": "testing_2",
                "taskListDescription": "test test test"
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

    it("Does not exist", () => {
        databaseInterface.insert
            .mockImplementationOnce((table, entry, callback) => {
                callback({ code: "ER_NO_REFERENCED_ROW_2" }, null);
            });

        return request(app)
            .post('/tasklist/create')
            .send({
                "userID": "nosuchid",
                "taskListName": "testing tasklist",
                "taskListID": "testing_2",
                "taskListDescription": "test test test"
            })
            .then(res => {
                expect(res.status).toBe(404);
                expect(res.body).toEqual({ msg: "entry does not exist" });
            });
    });

    it("Already exists", () => {
        databaseInterface.insert
            .mockImplementationOnce((table, entry, callback) => {
                callback({ code: "ER_DUP_ENTRY" }, null);
            });

        return request(app)
            .post('/tasklist/create')
            .send({
                "userID": "nosuchid",
                "taskListName": "testing tasklist",
                "taskListID": "testing_2",
                "taskListDescription": "test test test"
            })
            .then(res => {
                expect(res.status).toBe(406);
                expect(res.body).toEqual({ msg: "user/task/tasklist already exists" })
            });
    });

    // Bad data format not possible
});

describe("Update task list", () => {
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
                    "message": "(Rows matched: 1  Changed: 0  Warnings: 0",
                    "protocol41": true,
                    "changedRows": 0
                });
            });

        return request(app)
            .put('/tasklist/update')
            .send({
                "userID": "throwAway",
                "taskListID": "testing",
                "modifiedTime": "2020-11-01 02:10:23",
                "taskListDescription": "alsdkjalskd"
            })
            .then(res => {
                expect(res.status).toBe(200);
                expect(res.body).toEqual({
                    "fieldCount": 0,
                    "affectedRows": 1,
                    "insertId": 0,
                    "serverStatus": 2,
                    "warningCount": 0,
                    "message": "(Rows matched: 1  Changed: 0  Warnings: 0",
                    "protocol41": true,
                    "changedRows": 0
                });
            });
    });

    it("Switch owner", () => {
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
                    "message": "(Rows matched: 1  Changed: 0  Warnings: 0",
                    "protocol41": true,
                    "changedRows": 0
                });
            });

        return request(app)
            .put('/tasklist/update')
            .send({
                "userID": "throwAway",
                "newOwner": "throwAway2",
                "taskListID": "testing",
                "modifiedTime": "2020-11-01 02:10:23",
                "taskListDescription": "alsdkjalskd"
            })
            .then(res => {
                expect(res.status).toBe(200);
                expect(res.body).toEqual({
                    "fieldCount": 0,
                    "affectedRows": 1,
                    "insertId": 0,
                    "serverStatus": 2,
                    "warningCount": 0,
                    "message": "(Rows matched: 1  Changed: 0  Warnings: 0",
                    "protocol41": true,
                    "changedRows": 0
                });
            });
    });

    it("Bad data format", () => {
        databaseInterface.get
            .mockImplementationOnce((attributesToGet, table, condition, additional, callback) => {
                callback(null, [{ pad: 1 }]);
            });
        databaseInterface.update
            .mockImplementationOnce((table, values, condition, callback) => {
                callback({ code: "ER_TRUNCATED_WRONG_VALUE" }, null);
            });

        return request(app)
            .put('/tasklist/update')
            .send({
                "userID": "throwAway",
                "taskListID": "testing",
                "modifiedTime": "2020-11-01 02:10:23",
                "taskListDescription": "alsdkjalskd"
            })
            .then(res => {
                expect(res.status).toBe(400);
                expect(res.body).toEqual({ msg: "bad data format or type" });
            });
    });

    it("No permission", () => {
        databaseInterface.get
            .mockImplementationOnce((attributesToGet, table, condition, additional, callback) => {
                callback(null, []);
            });

        return request(app)
            .put('/tasklist/update')
            .send({
                "userID": "throwAway",
                "taskListID": "testing",
                "modifiedTime": "2020-11-01 02:10:23",
                "taskListDescription": "alsdkjalskd"
            })
            .then(res => {
                expect(res.status).toBe(401);
                expect(res.body).toEqual({ msg: "user does not have permissions" });
            });
    });

    // Does not exist not possible
});

describe("Add user to task list", () => {
    it("Normal operation", () => {
        databaseInterface.get
            .mockImplementationOnce((attributesToGet, table, condition, additional, callback) => {
                callback(null, [{ pad: 1 }]);
            });
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
            .post('/tasklist/adduser')
            .send({
                "userID": "throwAway",
                "taskListID": "testing",
                "addUser": "throwAway2"
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

    it("User adding himself", () => {
        return request(app)
            .post('/tasklist/adduser')
            .send({
                "userID": "throwAway",
                "taskListID": "testing",
                "addUser": "throwAway"
            })
            .then(res => {
                expect(res.status).toBe(406);
                expect(res.body).toEqual({ msg: "cannot add yourself" });
            });
    });

    it("No permission", () => {
        databaseInterface.get
            .mockImplementationOnce((attributesToGet, table, condition, additional, callback) => {
                callback(null, []);
            });

        return request(app)
            .post('/tasklist/adduser')
            .send({
                "userID": "throwAway",
                "taskListID": "otherlist",
                "addUser": "throwAway2"
            })
            .then(res => {
                expect(res.status).toBe(401);
                expect(res.body).toEqual({ msg: "user does not have permissions" });
            });
    });

    // SHOULD FAIL: NOT IMPLEMENTED YET
    it("Limit reached", () => {
        databaseInterface.get
            .mockImplementationOnce((attributesToGet, table, condition, additional, callback) => {
                callback(null, [{ pad: 1 }]);
            });
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
            .post('/tasklist/adduser')
            .send({
                "userID": "throwAway",
                "taskListID": "testing",
                "addUser": "throwAway2"
            })
            .then(res => {
                expect(res.status).toBe(402);
                expect(res.body).toEqual({ msg: "user does not have permissions" });
            });
    });
    // Bad data format not possible
});

describe("Kick user from task list", () => {
    it("Normal operation", () => {
        databaseInterface.get
            .mockImplementationOnce((attributesToGet, table, condition, additional, callback) => {
                callback(null, [{ pad: 1 }]);
            });
        databaseInterface.delete
            .mockImplementationOnce((table, condition, callback) => {
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
            .delete('/tasklist/kickuser')
            .send({
                "userID": "throwAway",
                "taskListID": "testing",
                "toKick": "throwAway2"
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
            .delete('/tasklist/kickuser')
            .send({
                "userID": "throwAway",
                "taskListID": "nosuchlist",
                "toKick": "throwAway2"
            })
            .then(res => {
                expect(res.status).toBe(401);
                expect(res.body).toEqual({ msg: "user does not have permissions" });
            });
    });

    it("User removing him/herself", () => {
        return request(app)
            .delete('/tasklist/kickuser')
            .send({
                "userID": "throwAway2",
                "taskListID": "nosuchlist",
                "toKick": "throwAway2"
            })
            .then(res => {
                expect(res.status).toBe(406);
                expect(res.body).toEqual({ msg: "cannot kick yourself" });
            });
    });

    // Bad data format not possible
});

describe("Delete task list", () => {
    it("Normal operation", () => {
        databaseInterface.get
            .mockImplementationOnce((attributesToGet, table, condition, additional, callback) => {
                callback(null, [{ pad: 1 }]);
            });
        databaseInterface.delete
            .mockImplementationOnce((table, condition, callback) => {
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
            .delete('/tasklist/delete')
            .send({
                "userID": "throwAway",
                "taskListID": "testing"
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

    it("No permissions", () => {
        databaseInterface.get
            .mockImplementationOnce((attributesToGet, table, condition, additional, callback) => {
                callback(null, []);
            });

        return request(app)
            .delete('/tasklist/delete')
            .send({
                "userID": "throwAway",
                "taskListID": "testing"
            })
            .then(res => {
                expect(res.status).toBe(401);
                expect(res.body).toEqual({ msg: "user does not have permissions" });
            });
    });

    // Bad format not possible
    // Does not exist not possible
});