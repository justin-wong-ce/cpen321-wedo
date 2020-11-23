const connection = require("./mysql");

function insertObj(obj, delimiter) {
    let retString = "";
    for (var attr in obj) {
        if (typeof obj[`${attr}`] === "string") {
            retString = retString.concat(attr + " = '" + obj[`${attr}`].toString() + "'" + delimiter);
        }
        else {
            retString = retString.concat(attr + " = " + obj[`${attr}`].toString() + delimiter);
        }
    }
    retString = retString.slice(0, -1 * delimiter.length);
    return retString;
}

var database = {
    get(attributesToGet, table, condition, additional, callback) {
        connection.query("SELECT " + attributesToGet + " FROM " + table + " WHERE " + insertObj(condition, " AND ") + additional, (err, results) => {
            callback(err, results);
        });
    },
    update(table, values, condition, callback) {
        connection.query("UPDATE " + table + " SET " + insertObj(values, ", ") + " WHERE " + insertObj(condition, "AND "), (err, results) => {
            callback(err, results);
        });
    },
    delete(table, condition, callback) {
        connection.query("DELETE FROM " + table + " WHERE " + insertObj(condition, "AND "), (err, results) => {
            callback(err, results);
        });
    },
    insert(table, entry, callback) {
        connection.query("INSERT INTO " + table + " SET " + insertObj(entry, ", "), (err, results) => {
            callback(err, results);
        });
    },
    getJoin(attributesToGet, table0, table1, joinCond, callback) {
        connection.query("SELECT " + attributesToGet + " FROM " + table0 + " INNER JOIN " + table1 + " ON " + joinCond, (err, results) => {
            callback(err, results);
        });
    }
};
module.exports = database;