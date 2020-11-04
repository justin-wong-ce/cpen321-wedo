const connection = require('./mysql')

console.log("using database interface")

var database = {
    get: function (attributesToGet, table, condition, callback) {

        console.log("SELECT from DB")

        connection.query('SELECT ' + attributesToGet + ' FROM ' + table + ' WHERE ' + condition, [], (err, results) => {

            if (err || !results) {
                console.log("error during SELECT, ", err);
            }
            callback(err, results);
        })
    },

    update: function (table, values, condition, callback) {
        connection.query('UPDATE ? SET ? WHERE ?', [table, values, condition], (err, results) => {
            if (err || !results) {
                console.log("error during UPDATE, ", err);
            }
            callback(err, results);
        })
    },

    delete: function (table, condition, callback) {
        connection.query('DELETE FROM ? WHERE ?', [table, condition], (err, results) => {
            if (err || !results) {
                console.log("error during DELETE, ", err);
            }
            callback(err, results);
        })
    },
    insert: function (table, entry, callback) {
        connection.query('INSERT INTO ? SET ?', [table, entry], (err, results) => {
            if (err || !results) {
                console.log("error during INSERT", err);
            }
            callback(err, results);
        })
    },

    shutdown: function () {
        console.log("terminating db connection");
        connection.destroy();
    }
}
module.exports = database