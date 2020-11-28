/* global jest */
var database = {
    get: jest.fn((attributesToGet, table, condition, additional, callback) => { }),
    update: jest.fn((table, values, condition, callback) => { }),
    delete: jest.fn((table, condition, callback) => { }),
    insert: jest.fn((table, entry, callback) => { }),
    getJoin: jest.fn((attributesToGet, table0, table1, joinCond, callback) => { })
};
module.exports = database;