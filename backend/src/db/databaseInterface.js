const connection = require('./mysql')
var database = {
    get: function (attributesToGet, table, condition, callback) {

        console.log('SELECT ' + attributesToGet + ' FROM ' + table + ' WHERE ' + condition)
        connection.query('SELECT ' + attributesToGet + ' FROM ' + table + ' WHERE ' + condition, [], (err, results) => {
            if (err || !results) {
                console.log("error during SELECT, ", err);
                callback(err, results);
            }
            else {
                callback(err, results);
            }
        })
    },
    update: function (table, values, condition, callback) {
        connection.query('UPDATE ? SET ? WHERE ?', [table, values, condition], (err, results) => {
            if (err || !results) {
                console.log("error during UPDATE, ", err);
                callback(err, results);
            }
            else {
                callback(err, results);
            }
        })
    },
    delete: function (table, condition, callback) {
        connection.query('DELETE FROM ? WHERE ?', [table, condition], (err, results) => {
            if (err || !results) {
                console.log("error during DELETE, ", err);
                callback(err, results);
            }
            else {
                callback(err, results);
            }
        })
    }
}
module.exports = database