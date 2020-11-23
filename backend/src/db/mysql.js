const mysql = require("mysql");

const connection = mysql.createConnection({
    host: "localhost",
    user: "cpen321",
    password: "*cpen321Wed0$$",
    database: "cpen321_wedo"
});

module.exports = connection;