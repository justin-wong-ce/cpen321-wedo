const connection = require('./mysql')

var taskFunctions = {
    checkAccess: function (taskListID, userID, hasAccess) {
        connection.query('SELECT * FROM HasAccess WHERE taskListID = ? AND userID = ?', [taskListID, userID], (err, taskList) => {
            if (err) hasAccess(false);
            else hasAccess(true);
        })
    },

}

module.exports = taskFunctions