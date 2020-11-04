const database = jest.createMockFromModule('../databaseInterface');
function get(attributesToGet, table, condition, callback) {
    callback("",
        [{ "taskListID": 1 },
        { "taskListID": 2 },
        { "taskListID": 8 },
        { "taskListID": 200 }])
}

// jest.mock('../databaseInterface', () => ({
//     get: (attributesToGet, table, condition, callback) => callback("", [
//         { "taskListID": 1 },
//         { "taskListID": 2 },
//         { "taskListID": 8 },
//         { "taskListID": 200 }])
// }))

database.get = get;
module.exports = database;