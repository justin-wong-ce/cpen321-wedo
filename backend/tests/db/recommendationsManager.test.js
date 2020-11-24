/* global jest */
jest.setTimeout(5000);
jest.mock("../../src/db/databaseInterface");
const databaseInterface = require("../../src/db/databaseInterface");
const recManager = require("../../src/db/recommendationsManager");

describe("Test getting preferences", () => {
    it("Normal operation", () => {
        databaseInterface.get
            .mockImplementationOnce((attributesToGet, table, condition, additional, callback) => {
                callback(null, [{ preferences: "{\"shopping\": 0, \"transport\": 0, \"setup\": 0, \"repair\": 0, \"study\": 0, \"work\": 1, \"fun\": 2}" }
                ]);
            });

        recManager.getPreferences("tester", (err, results) => {
            expect(results).toEqual("{\"shopping\": 0, \"transport\": 0, \"setup\": 0, \"repair\": 0, \"study\": 0, \"work\": 1, \"fun\": 2}");
        });
    });
});

describe("Test updating preferences", () => {
    it("Normal operation", () => {
        databaseInterface.get
            .mockImplementationOnce((attributesToGet, table, condition, additional, callback) => {
                callback(null, [{ preferences: "{\"shopping\": 0, \"transport\": 0, \"setup\": 0, \"repair\": 0, \"study\": 0, \"work\": 1, \"fun\": 2}" }
                ]);
            })
            .mockImplementationOnce((attributesToGet, table, condition, additional, callback) => {
                callback(null, [{ taskType: "fun" }]);
            });
        databaseInterface.update
            .mockImplementationOnce((table, values, condition, callback) => {
                callback(null, {
                    "fieldCount": 0, "affectedRows": 1, "insertId": 0, "serverStatus": 2, "warningCount": 0, "message": "(Rows matched: 1  Changed: 0  Warnings: 0", "protocol41": true, "changedRows": 0
                });
            });

        recManager.updatePreferences("tester", 4, "task0", (err, results) => {
            expect(results).toStrictEqual({
                "fieldCount": 0, "affectedRows": 1, "insertId": 0, "serverStatus": 2, "warningCount": 0, "message": "(Rows matched: 1  Changed: 0  Warnings: 0", "protocol41": true, "changedRows": 0
            });
        });
    });
});

let tasks = [{ "priorityLevel": 1, "taskType": "shopping" }, { "priorityLevel": 1, "taskType": "fun" }, { "priorityLevel": 1, "taskType": "work" }, { "priorityLevel": 0, "taskType": "work" }, { "priorityLevel": 0, "taskType": "fun" }];

let sortedTasks = [{ "priorityLevel": 1, "taskType": "fun" }, { "priorityLevel": 1, "taskType": "work" }, { "priorityLevel": 1, "taskType": "shopping" }, { "priorityLevel": 0, "taskType": "fun" }, { "priorityLevel": 0, "taskType": "work" }];

describe("Test sorting tasks", () => {
    it("Normal operation", () => {
        databaseInterface.get
            .mockImplementationOnce((attributesToGet, table, condition, additional, callback) => {
                callback(null, [{ preferences: "{\"shopping\": 0, \"transport\": 0, \"setup\": 0, \"repair\": 0, \"study\": 0, \"work\": 1, \"fun\": 2}" }
                ]);
            });

        recManager.sortTasks(tasks, "tester", (err, results) => {
            expect(results).toStrictEqual(sortedTasks);
        });
    });
});