const userFunctions = require('../../src/db/users_db')

user4Tasklists = [{ "taskListID": 1 }, { "taskListID": 2 }, { "taskListID": 8 }, { "taskListID": 200 }];

jest.mock('../../src/db/databaseInterface', () => ({
    get: (attributesToGet, table, condition, callback) => callback("", [
        { "taskListID": 1 },
        { "taskListID": 2 },
        { "taskListID": 8 },
        { "taskListID": 200 }])
}))

test('User has access', done => {
    console.log("starting test")

    userFunctions.getUserLists(4, (err, results) => {
        console.log(results);
        expect(results).toStrictEqual(user4Tasklists);
        done();
    })
})