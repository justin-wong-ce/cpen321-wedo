const connection = require("./mysql");

var database = {
    get(attributesToGet, table, condition, callback) {
        connection.query("SELECT " + attributesToGet + " FROM " + table + " WHERE " + condition, [], (err, results) => {
            callback(err, results);
        });
    },
    update(table, values, condition, callback) {
        connection.query("UPDATE ? SET ? WHERE ?", [table, values, condition], (err, results) => {
            callback(err, results);
        });
    },
    delete(table, condition, callback) {
        connection.query("DELETE FROM ? WHERE ?", [table, condition], (err, results) => {
            callback(err, results);
        });
    },
    insert(table, entry, callback) {
        connection.query("INSERT INTO ? SET ?", [table, entry], (err, results) => {
            callback(err, results);
        });
    }
};
module.exports = database;