/* global jest */
const { app, server } = require("../../src/server");
const request = require("supertest");

jest.setTimeout(5000);
jest.mock("../../src/db/databaseInterface");
jest.mock("../../src/db/recommendationsManager");
jest.mock("../../src/db/users_db");
jest.mock("../../src/routers/pushNotification");
jest.mock("../../src/routers/user.js");
jest.mock("../../src/routers/routes.js");
jest.mock("../../src/routers/task.js");
jest.mock("firebase-admin");
const databaseInterface = require("../../src/db/databaseInterface");
const recManager = require("../../src/db/recommendationsManager");
const userFunctions = require("../../src/db/users_db");
const pushNotification = require("../../src/routers/pushNotification");

userFunctions.getTokensInList
    .mockImplementation((userID, taskListID, callback) => {
        callback(null, ["test1", "test2", "test3", "test4"]);
    });
pushNotification
    .mockImplementation((title, body, tokens) => {
        return;
    });

const updateResponse = {
    "fieldCount": 0, "affectedRows": 1, "insertId": 0, "serverStatus": 2, "warningCount": 0, "message": "(Rows matched: 1  Changed: 0  Warnings: 0", "protocol41": true, "changedRows": 0
};

const insertResponse = updateResponse;

const standardTasklist = {
    "userID": "throwAway", "taskListName": "testing tasklist", "taskListID": "testing_2", "taskListDescription": "test test test"
};

const standardUpdate = {
    "userID": "throwAway", "taskListID": "testing", "modifiedTime": "2020-11-01 02:10:23", "taskListDescription": "alsdkjalskd"
};

const tasksResponse = [
    {
        "taskID": "testing_task1", "createdBy": "throwAway", "taskBudget": 123, "taskDescription": "task for testing MODIFIED", "taskType": "transport", "priorityLevel": 0, "address": "UBC, Vancouver", "done": null, "assignedTo": null, "taskRating": null, "createdTime": "2020-11-01T02:10:23.000Z", "modifiedTime": null, "taskName": "test_task_0", "taskListID": "testing"
    }];

beforeAll(() => {
    server.listen(3003);
});

describe("Get tasks in task list", () => {
    it("Successfully get tasks", () => {
        userFunctions.checkPermission
            .mockImplementationOnce((userID, taskListID, callback) => {
                callback(null, [{ pad: 1 }]);
            });
        databaseInterface.get
            .mockImplementationOnce((attributesToGet, table, condition, additional, callback) => {
                callback(null, [{ filler: "filler" }]);
            });
        recManager.sortTasks
            .mockImplementationOnce((tasks, userID, callback) => {
                callback(null, tasksResponse);
            });

        return request(app)
            .get("/tasklist/get/'throwAway'/'testing'")
            .then((res) => {
                expect(res.status).toBe(200);
                expect(res.body).toEqual(tasksResponse);
            });
    });

    it("No permissions", () => {
        userFunctions.checkPermission
            .mockImplementationOnce((userID, taskListID, callback) => {
                callback(null, []);
            });

        return request(app)
            .get("/tasklist/get/'throwAway'/'testing'")
            .then((res) => {
                expect(res.status).toBe(401);
                expect(res.body).toEqual({ msg: "user does not have permissions" });
            });
    });

    // Bad data format not possible
    // Does not exist not possible
});

describe("Create task list", () => {
    it("Successfully create task list", () => {
        databaseInterface.insert
            .mockImplementationOnce((table, entry, callback) => {
                callback(null, insertResponse);
            })
            .mockImplementationOnce((table, entry, callback) => {
                callback(null, insertResponse);
            });

        return request(app)
            .post("/tasklist/create")
            .send(standardTasklist)
            .then((res) => {
                expect(res.status).toBe(200);
                expect(res.body).toEqual(insertResponse);
            });
    });

    it("Does not exist", () => {
        databaseInterface.insert
            .mockImplementationOnce((table, entry, callback) => {
                callback({ code: "ER_NO_REFERENCED_ROW_2" }, null);
            });

        return request(app)
            .post("/tasklist/create")
            .send({
                "userID": "nosuchid",
                "taskListName": "testing tasklist",
                "taskListID": "testing_2",
                "taskListDescription": "test test test"
            })
            .then((res) => {
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
            .post("/tasklist/create")
            .send({
                "userID": "nosuchid",
                "taskListName": "testing tasklist",
                "taskListID": "testing_2",
                "taskListDescription": "test test test"
            })
            .then((res) => {
                expect(res.status).toBe(406);
                expect(res.body).toEqual({ msg: "user/task/tasklist already exists" });
            });
    });

    // Bad data format not possible
});

describe("Update task list", () => {
    it("Successfully update task list", () => {
        userFunctions.isListOwner
            .mockImplementationOnce((userID, taskListID, callback) => {
                callback(null, [{ pad: 1 }]);
            });
        databaseInterface.update
            .mockImplementationOnce((table, values, condition, callback) => {
                callback(null, updateResponse);
            });

        return request(app)
            .put("/tasklist/update")
            .send(standardUpdate)
            .then((res) => {
                expect(res.status).toBe(200);
                expect(res.body).toEqual(updateResponse);
            });
    });

    it("Switch owner", () => {
        userFunctions.isListOwner
            .mockImplementationOnce((userID, taskListID, callback) => {
                callback(null, [{ pad: 1 }]);
            });
        databaseInterface.update
            .mockImplementationOnce((table, values, condition, callback) => {
                callback(null, updateResponse);
            });

        return request(app)
            .put("/tasklist/update")
            .send({
                "userID": "throwAway", "newOwner": "throwAway2", "taskListID": "testing", "modifiedTime": "2020-11-01 02:10:23", "taskListDescription": "alsdkjalskd"
            })
            .then((res) => {
                expect(res.status).toBe(200);
                expect(res.body).toEqual(updateResponse);
            });
    });

    it("Bad data format", () => {
        userFunctions.isListOwner
            .mockImplementationOnce((userID, taskListID, callback) => {
                callback(null, [{ pad: 1 }]);
            });
        databaseInterface.update
            .mockImplementationOnce((table, values, condition, callback) => {
                callback({ code: "ER_TRUNCATED_WRONG_VALUE" }, null);
            });

        return request(app)
            .put("/tasklist/update")
            .send(standardUpdate)
            .then((res) => {
                expect(res.status).toBe(400);
                expect(res.body).toEqual({ msg: "bad data format or type" });
            });
    });

    it("No permission", () => {
        userFunctions.isListOwner
            .mockImplementationOnce((userID, taskListID, callback) => {
                callback(null, []);
            });

        return request(app)
            .put("/tasklist/update")
            .send(standardUpdate)
            .then((res) => {
                expect(res.status).toBe(401);
                expect(res.body).toEqual({ msg: "user does not have permissions" });
            });
    });

    // Does not exist not possible
});

describe("Add user to task list", () => {
    it("Successfully add user to task list", () => {
        userFunctions.isListOwner
            .mockImplementationOnce((userID, taskListID, callback) => {
                callback(null, [{ pad: 1 }]);
            });
        databaseInterface.get
            .mockImplementationOnce((attributesToGet, table, condition, additional, callback) => {
                callback(null, [{ isPremium: 1 }]);
            })
            .mockImplementationOnce((attributesToGet, table, condition, additional, callback) => {
                callback(null, [{ "COUNT(*)": 2 }]);
            })
            .mockImplementationOnce((attributesToGet, table, condition, additional, callback) => {
                callback(null, [{ token: "" }]);
            })
            .mockImplementationOnce((attributesToGet, table, condition, additional, callback) => {
                callback(null, [{ taskListName: "" }]);
            });
        databaseInterface.insert
            .mockImplementationOnce((table, entry, callback) => {
                callback(null, insertResponse);
            });


        return request(app)
            .post("/tasklist/adduser")
            .send({
                "userID": "throwAway", "taskListID": "testing", "addUser": "throwAway2"
            })
            .then((res) => {
                expect(res.status).toBe(200);
                expect(res.body).toEqual(insertResponse);
            });
    });

    it("User adding himself", () => {
        return request(app)
            .post("/tasklist/adduser")
            .send({
                "userID": "throwAway", "taskListID": "testing", "addUser": "throwAway"
            })
            .then((res) => {
                expect(res.status).toBe(406);
                expect(res.body).toEqual({ msg: "cannot add yourself" });
            });
    });

    it("No permission", () => {
        userFunctions.isListOwner
            .mockImplementationOnce((userID, taskListID, callback) => {
                callback(null, []);
            });

        return request(app)
            .post("/tasklist/adduser")
            .send({
                "userID": "throwAway", "taskListID": "otherlist", "addUser": "throwAway2"
            })
            .then((res) => {
                expect(res.status).toBe(401);
                expect(res.body).toEqual({ msg: "user does not have permissions" });
            });
    });
    it("Limit reached", () => {
        userFunctions.isListOwner
            .mockImplementationOnce((userID, taskListID, callback) => {
                callback(null, [{ pad: 1 }]);
            });
        databaseInterface.get
            .mockImplementationOnce((attributesToGet, table, condition, additional, callback) => {
                callback(null, [{ isPremium: 0 }]);
            })
            .mockImplementationOnce((attributesToGet, table, condition, additional, callback) => {
                callback(null, [{ "COUNT(*)": 5 }]);
            });
        databaseInterface.insert
            .mockImplementationOnce((table, entry, callback) => {
                callback(null, insertResponse);
            });

        return request(app)
            .post("/tasklist/adduser")
            .send({
                "userID": "throwAway", "taskListID": "testing", "addUser": "throwAway2"
            })
            .then((res) => {
                expect(res.status).toBe(401);
                expect(res.body).toEqual({ msg: "user needs to buy premium" });
            });
    });
    // Bad data format not possible
});

describe("Kick user from task list", () => {
    it("Successfully kick user from task list", () => {
        userFunctions.isListOwner
            .mockImplementationOnce((userID, taskListID, callback) => {
                callback(null, [{ pad: 1 }]);
            });
        databaseInterface.delete
            .mockImplementationOnce((table, condition, callback) => {
                callback(null, insertResponse);
            });
        databaseInterface.get
            .mockImplementationOnce((attributesToGet, table, condition, additional, callback) => {
                callback(null, [{ token: "" }]);
            })
            .mockImplementationOnce((attributesToGet, table, condition, additional, callback) => {
                callback(null, [{ taskListName: "" }]);
            });

        return request(app)
            .delete("/tasklist/kickuser/'throwAway'/'testing'/'throwAway2'")
            .then((res) => {
                expect(res.status).toBe(200);
                expect(res.body).toEqual(insertResponse);
            });
    });

    it("No permission", () => {
        userFunctions.isListOwner
            .mockImplementationOnce((userID, taskListID, callback) => {
                callback(null, []);
            });

        return request(app)
            .delete("/tasklist/kickuser/'throwAway'/'nosuchlist'/'throwAway2'")
            .then((res) => {
                expect(res.status).toBe(401);
                expect(res.body).toEqual({ msg: "user does not have permissions" });
            });
    });

    it("User removing him/herself", () => {
        return request(app)
            .delete("/tasklist/kickuser/'throwAway2'/'nosuchlist'/'throwAway2'")
            .then((res) => {
                expect(res.status).toBe(406);
                expect(res.body).toEqual({ msg: "cannot kick yourself" });
            });
    });

    // Bad data format not possible
});

describe("Delete task list", () => {
    it("Successfully delete task list", () => {
        userFunctions.isListOwner
            .mockImplementationOnce((userID, taskListID, callback) => {
                callback(null, [{ pad: 1 }]);
            });
        databaseInterface.delete
            .mockImplementationOnce((table, condition, callback) => {
                callback(null, insertResponse);
            });
        databaseInterface.get
            .mockImplementationOnce((attributesToGet, table, condition, additional, callback) => {
                callback(null, [{ taskListName: "" }]);
            });

        return request(app)
            .delete("/tasklist/delete/'throwAway'/'testing'")
            .then((res) => {
                expect(res.status).toBe(200);
                expect(res.body).toEqual(insertResponse);
            });
    });

    it("Successfully delete task list but no other uses in task list", () => {
        userFunctions.isListOwner
            .mockImplementationOnce((userID, taskListID, callback) => {
                callback(null, [{ pad: 1 }]);
            });
        databaseInterface.delete
            .mockImplementationOnce((table, condition, callback) => {
                callback(null, insertResponse);
            });
        databaseInterface.get
            .mockImplementationOnce((attributesToGet, table, condition, additional, callback) => {
                callback(null, [{ taskListName: "" }]);
            });
        userFunctions.getTokensInList
            .mockImplementationOnce((userID, taskListID, callback) => {
                callback(null, []);
            });

        return request(app)
            .delete("/tasklist/delete/'throwAway'/'testing'")
            .then((res) => {
                expect(res.status).toBe(200);
                expect(res.body).toEqual(insertResponse);
            });
    });

    it("No permissions", () => {
        userFunctions.isListOwner
            .mockImplementationOnce((userID, taskListID, callback) => {
                callback(null, []);
            });

        return request(app)
            .delete("/tasklist/delete/'throwAway'/'testing'")
            .then((res) => {
                expect(res.status).toBe(401);
                expect(res.body).toEqual({ msg: "user does not have permissions" });
            });
    });

    // Bad format not possible
    // Does not exist not possible
});