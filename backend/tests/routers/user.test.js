const userFunctions = require('../../src/db/users_db')
const database = require('../../src/db/databaseInterface')

jest.mock('../../src/db/databaseInterface')

test('User has access', () => {
    expectedResult = [
        { "taskListID": 1 },
        { "taskListID": 2 },
        { "taskListID": 5 }];
    database.get.mockResolvedValue = expectedResult;
    userFunctions.getUserLists(4, (err, results) => {
        expect(results).toBe(expectedResult);
    })
})