/* global jest */
const { app, server } = require("../../src/server");
const request = require("supertest");

jest.setTimeout(5000);
jest.mock("../../src/db/databaseInterface");
jest.mock("../../src/db/recommendationsManager");
jest.mock("../../src/db/users_db");
jest.mock("../../src/routers/pushNotification");
jest.mock("../../src/routers/user.js");
jest.mock("../../src/routers/taskList.js");
jest.mock("../../src/routers/routes.js");
jest.mock("firebase-admin");
const databaseInterface = require("../../src/db/databaseInterface");
const recManager = require("../../src/db/recommendationsManager");
const userFunctions = require("../../src/db/users_db");
const pushNotification = require("../../src/routers/pushNotification");

userFunctions.getTokensInList
    .mockImplementation((userID, taskListID, callback) => {
        callback(null, ["test1", "test2", "test4", "test5"]);
    });
pushNotification
    .mockImplementation((title, body, tokens) => {
        return;
    });

const modifyResponse = {
    "affectedRows": 1, "insertId": 0, "fieldCount": 0, "serverStatus": 2, "warningCount": 0, "message": "", "protocol41": true, "changedRows": 0
};

const standardTask = {
    "userID": "tester", "taskID": "12322_task1", "taskListID": "12322", "taskName": "test_task_1", "taskType": "transport", "createdTime": "2020-11-01 02:10:23", "taskDescription": "task for testing", "taskBudget": 123, "address": "UBC, Vancouver"
};

beforeAll(() => {
    server.listen(3002);
});

describe("Create task", () => {
    it("Normal operation", () => {
        userFunctions.checkPermission
            .mockImplementationOnce((userID, taskListID, callback) => {
                callback(null, [{ pad: 1 }]);
            });
        databaseInterface.get
            .mockImplementationOnce((attributesToGet, table, condition, additional, callback) => {
                callback(null, [{ isPremium: 1 }]);
            }).mockImplementationOnce((attributesToGet, table, condition, additional, callback) => {
                callback(null, [{ "COUNT(*)": 1 }]);
            });
        databaseInterface.insert
            .mockImplementationOnce((table, entry, callback) => {
                callback(null, modifyResponse);
            });

        return request(app)
            .post("/task/create")
            .send(standardTask)
            .then((res) => {
                expect(res.status).toBe(200);
                expect(res.body).toEqual(modifyResponse);
            });
    });

    it("Normal operation but no other user in task list", () => {
        userFunctions.checkPermission
            .mockImplementationOnce((userID, taskListID, callback) => {
                callback(null, [{ pad: 1 }]);
            });
        databaseInterface.get
            .mockImplementationOnce((attributesToGet, table, condition, additional, callback) => {
                callback(null, [{ isPremium: 1 }]);
            }).mockImplementationOnce((attributesToGet, table, condition, additional, callback) => {
                callback(null, [{ "COUNT(*)": 1 }]);
            });
        databaseInterface.insert
            .mockImplementationOnce((table, entry, callback) => {
                callback(null, modifyResponse);
            });
        userFunctions.getTokensInList
            .mockImplementationOnce((userID, taskListID, callback) => {
                callback(null, []);
            });

        return request(app)
            .post("/task/create")
            .send(standardTask)
            .then((res) => {
                expect(res.status).toBe(200);
                expect(res.body).toEqual(modifyResponse);
            });
    });

    it("No permission", () => {
        userFunctions.checkPermission
            .mockImplementationOnce((userID, taskListID, callback) => {
                callback(null, []);
            });

        return request(app)
            .post("/task/create")
            .send(standardTask)
            .then((res) => {
                expect(res.status).toBe(401);
                expect(res.body).toEqual({ msg: "user does not have permissions" });
            });
    });

    it("Bad format", () => {
        userFunctions.checkPermission
            .mockImplementationOnce((userID, taskListID, callback) => {
                callback(null, [{ pad: 1 }]);
            });
        databaseInterface.get
            .mockImplementationOnce((attributesToGet, table, condition, additional, callback) => {
                callback(null, [{ isPremium: 1 }]);
            }).mockImplementationOnce((attributesToGet, table, condition, additional, callback) => {
                callback(null, [{ "COUNT(*)": 1 }]);
            });
        databaseInterface.insert
            .mockImplementationOnce((table, entry, callback) => {
                callback({ code: "ER_TRUNCATED_WRONG_VALUE" }, null);
            });

        return request(app)
            .post("/task/create")
            .send(standardTask)
            .then((res) => {
                expect(res.status).toBe(400);
                expect(res.body).toEqual({ msg: "bad data format or type" });
            });
    });

    it("Already exists", () => {
        userFunctions.checkPermission
            .mockImplementationOnce((userID, taskListID, callback) => {
                callback(null, [{ pad: 1 }]);
            });
        databaseInterface.get
            .mockImplementationOnce((attributesToGet, table, condition, additional, callback) => {
                callback(null, [{ isPremium: 1 }]);
            }).mockImplementationOnce((attributesToGet, table, condition, additional, callback) => {
                callback(null, [{ "COUNT(*)": 1 }]);
            });
        databaseInterface.insert
            .mockImplementationOnce((table, entry, callback) => {
                callback({ code: "ER_DUP_ENTRY" }, null);
            });

        return request(app)
            .post("/task/create")
            .send(standardTask)
            .then((res) => {
                expect(res.status).toBe(406);
                expect(res.body).toEqual({ msg: "user/task/tasklist already exists" });
            });
    });

    it("Number of tasks limit reached", () => {
        userFunctions.checkPermission
            .mockImplementationOnce((userID, taskListID, callback) => {
                callback(null, [{ pad: 1 }, { pad: 2 }, { pad: 3 }, { pad: 4 }, { pad: 5 }]);
            });
        databaseInterface.get
            .mockImplementationOnce((attributesToGet, table, condition, additional, callback) => {
                callback(null, [{ isPremium: 0 }]);
            }).mockImplementationOnce((attributesToGet, table, condition, additional, callback) => {
                callback(null, [{ "COUNT(*)": 10 }]);
            });

        return request(app)
            .post("/task/create")
            .send(standardTask)
            .then((res) => {
                expect(res.status).toBe(401);
                expect(res.body).toEqual({ msg: "user needs to buy premium" });
            });
    });

    it("Number of tasks limit reached but user has premium", () => {
        userFunctions.checkPermission
            .mockImplementationOnce((userID, taskListID, callback) => {
                callback(null, [{ pad: 1 }]);
            });
        databaseInterface.get
            .mockImplementationOnce((attributesToGet, table, condition, additional, callback) => {
                callback(null, [{ isPremium: 1 }]);
            }).mockImplementationOnce((attributesToGet, table, condition, additional, callback) => {
                callback(null, [{ "COUNT(*)": 10 }]);
            });
        databaseInterface.insert
            .mockImplementationOnce((table, entry, callback) => {
                callback(null, modifyResponse);
            });

        return request(app)
            .post("/task/create")
            .send(standardTask)
            .then((res) => {
                expect(res.status).toBe(200);
                expect(res.body).toEqual(modifyResponse);
            });
    });

    // "Does not exist" not possible (no perms/does not exist same return value from DB)
});

describe("Update task", () => {
    it("Normal operation (task is not done)", () => {
        userFunctions.checkPermission
            .mockImplementationOnce((userID, taskListID, callback) => {
                callback(null, [{ pad: 1 }]);
            });
        databaseInterface.update
            .mockImplementationOnce((table, values, condition, callback) => {
                callback(null, modifyResponse);
            });

        return request(app)
            .put("/task/update")
            .send(standardTask)
            .then((res) => {
                expect(res.status).toBe(200);
                expect(res.body).toEqual(modifyResponse);
            });
    });

    it("Normal operation (task is done)", () => {
        userFunctions.checkPermission
            .mockImplementationOnce((userID, taskListID, callback) => {
                callback(null, [{ pad: 1 }]);
            });
        databaseInterface.update
            .mockImplementationOnce((table, values, condition, callback) => {
                callback(null, modifyResponse);
            });
        recManager.updatePreferences
            .mockImplementationOnce((userID, points, taskID, callback) => {
                callback(null, modifyResponse);
            });

        return request(app)
            .put("/task/update")
            .send({
                "userID": "tester", "taskID": "12322_task1", "taskListID": "12322", "taskName": "test_task_1", "taskType": "transport", "createdTime": "2020-11-01 02:10:23", "taskDescription": "task for testing", "taskBudget": 123, "address": "UBC, Vancouver", "done": true, "taskRating": 4
            })
            .then((res) => {
                expect(res.status).toBe(200);
                expect(res.body).toEqual(modifyResponse);
            });
    });

    it("Normal operation (task is done but no other user is in task list)", () => {
        userFunctions.checkPermission
            .mockImplementationOnce((userID, taskListID, callback) => {
                callback(null, [{ pad: 1 }]);
            });
        databaseInterface.update
            .mockImplementationOnce((table, values, condition, callback) => {
                callback(null, modifyResponse);
            });
        recManager.updatePreferences
            .mockImplementationOnce((userID, points, taskID, callback) => {
                callback(null, modifyResponse);
            });
        userFunctions.getTokensInList
            .mockImplementationOnce((userID, taskListID, callback) => {
                callback(null, []);
            });

        return request(app)
            .put("/task/update")
            .send({
                "userID": "tester", "taskID": "12322_task1", "taskListID": "12322", "taskName": "test_task_1", "taskType": "transport", "createdTime": "2020-11-01 02:10:23", "taskDescription": "task for testing", "taskBudget": 123, "address": "UBC, Vancouver", "done": true, "taskRating": 4
            })
            .then((res) => {
                expect(res.status).toBe(200);
                expect(res.body).toEqual(modifyResponse);
            });
    });

    it("No permission", () => {
        userFunctions.checkPermission
            .mockImplementationOnce((userID, taskListID, callback) => {
                callback(null, []);
            });

        return request(app)
            .put("/task/update")
            .send({
                "userID": "tester", "taskID": "12322_task1", "taskListID": "someOtherTask", "taskName": "test_task_1", "taskType": "transport", "createdTime": "2020-11-01 02:10:23", "taskDescription": "task for testing", "taskBudget": 123, "address": "UBC, Vancouver"
            })
            .then((res) => {
                expect(res.status).toBe(401);
                expect(res.body).toEqual({ msg: "user does not have permissions" });
            });
    });

    it("Bad format", () => {
        userFunctions.checkPermission
            .mockImplementationOnce((userID, taskListID, callback) => {
                callback(null, [{ pad: 1 }]);
            });
        databaseInterface.update
            .mockImplementationOnce((table, values, condition, callback) => {
                callback({ code: "ER_TRUNCATED_WRONG_VALUE" }, null);
            });

        return request(app)
            .put("/task/update")
            .send(standardTask)
            .then((res) => {
                expect(res.status).toBe(400);
                expect(res.body).toEqual({ msg: "bad data format or type" });
            });
    });

    it("Task does not exist", () => {
        userFunctions.checkPermission
            .mockImplementationOnce((userID, taskListID, callback) => {
                callback(null, [{ pad: 1 }]);
            });
        databaseInterface.update
            .mockImplementationOnce((table, values, condition, callback) => {
                callback(null, { affectedRows: 0 });
            });

        return request(app)
            .put("/task/update")
            .send(standardTask)
            .then((res) => {
                expect(res.status).toBe(404);
                expect(res.body).toEqual({ msg: "entry does not exist" });
            });
    });
});

describe("Delete task", () => {
    it("Normal operation", () => {
        userFunctions.checkPermission
            .mockImplementationOnce((userID, taskListID, callback) => {
                callback(null, [{ pad: 1 }]);
            });
        databaseInterface.delete
            .mockImplementationOnce((table, condition, callback) => {
                callback(null, modifyResponse);
            });
        databaseInterface.get
            .mockImplementationOnce((attributesToGet, table, condition, additional, callback) => {
                callback(null, [{ taskName: "" }]);
            });

        return request(app)
            .delete("/task/delete/'tester'/'12322_task1'/'12322'")
            .then((res) => {
                expect(res.status).toBe(200);
                expect(res.body).toEqual(modifyResponse);
            });
    });

    it("Normal operation, but no other user in task", () => {
        userFunctions.checkPermission
            .mockImplementationOnce((userID, taskListID, callback) => {
                callback(null, [{ pad: 1 }]);
            });
        databaseInterface.delete
            .mockImplementationOnce((table, condition, callback) => {
                callback(null, modifyResponse);
            });
        databaseInterface.get
            .mockImplementationOnce((attributesToGet, table, condition, additional, callback) => {
                callback(null, [{ taskName: "" }]);
            });
        userFunctions.getTokensInList
            .mockImplementationOnce((userID, taskListID, callback) => {
                callback(null, []);
            });

        return request(app)
            .delete("/task/delete/'tester'/'12322_task1'/'12322'")
            .then((res) => {
                expect(res.status).toBe(200);
                expect(res.body).toEqual(modifyResponse);
            });
    });

    it("No permission", () => {
        userFunctions.checkPermission
            .mockImplementationOnce((userID, taskListID, callback) => {
                callback(null, []);
            });

        return request(app)
            .delete("/task/delete/'tester'/'12322_task1'/'12322'")
            .then((res) => {
                expect(res.status).toBe(401);
                expect(res.body).toEqual({ msg: "user does not have permissions" });
            });
    });

    it("Does not exist", () => {
        userFunctions.checkPermission
            .mockImplementationOnce((userID, taskListID, callback) => {
                callback(null, [{ pad: 1 }]);
            });
        databaseInterface.delete
            .mockImplementationOnce((table, condition, callback) => {
                callback(null, { affectedRows: 0 });
            });
        databaseInterface.get
            .mockImplementationOnce((attributesToGet, table, condition, additional, callback) => {
                callback(null, [{ taskName: "" }]);
            });

        return request(app)
            .delete("/task/delete/'tester'/'12322_task1'/'12322'")
            .then((res) => {
                expect(res.status).toBe(404);
                expect(res.body).toEqual({ msg: "entry does not exist" });
            });
    });

    it("Bad data format", () => {
        userFunctions.checkPermission
            .mockImplementationOnce((userID, taskListID, callback) => {
                callback(null, [{ pad: 1 }]);
            });
        databaseInterface.delete
            .mockImplementationOnce((table, condition, callback) => {
                callback({ code: "ER_TRUNCATED_WRONG_VALUE" }, null);
            });
        databaseInterface.get
            .mockImplementationOnce((attributesToGet, table, condition, additional, callback) => {
                callback(null, [{ taskName: "" }]);
            });

        return request(app)
            .delete("/task/delete/'tester'/'12322_task1'/'12322'")
            .then((res) => {
                expect(res.status).toBe(400);
                expect(res.body).toEqual({ msg: "bad data format or type" });
            });
    });
});