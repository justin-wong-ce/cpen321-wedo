const userFunctions = require("../../src/db/users_db");

let user4Tasklists = [{ "taskListID": 1 }, { "taskListID": 2 }, { "taskListID": 8 }, { "taskListID": 200 }];

jest.mock("../../src/db/databaseInterface");

test("User has access", done => {
    userFunctions.getUserLists(4, (err, results) => {
        expect(results).toStrictEqual(user4Tasklists);
        done();
    });
});