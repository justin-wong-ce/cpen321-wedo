const connection = require('./mysql')

var taskListFunctions = {
    getTasksInList: function (taskListID, callback) {
        database.get('*', 'TaskHasTaskList', 'tasklistID = ' + taskListID, (err, results) => {
            callback(err, results);
        })
    },
    createTaskList: function (entry, callback) {
        database.insert("TaskListWithOwner", entry, (err, results) => {
            callback(err, results);
        })
    },
    sortList: function (list) {

        return sorted;
    }

}

module.exports = taskListFunctions