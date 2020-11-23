const database = require("./databaseInterface");

function getPreferences(userID, callback) {
    database.get("preferences", "Users", { userID }, "", (err, results) => {
        callback(err, results[0].preferences);
    });
}

function updatePreferences(userID, points, taskID, callback) {
    // 1. Get preferences of user
    // 2. Parse + change value
    // 3. Stringify + update
    getPreferences(userID, (err, pref) => {
        database.get("taskType", "TaskHasTaskList", { taskID }, "", (err, retType) => {
            let taskType = retType[0].taskType;

            let preferences = JSON.parse(pref);
            preferences[`${taskType}`] = preferences[`${taskType}`] + points;

            let newPreferences = JSON.stringify(preferences);
            database.update("Users", { preferences: newPreferences }, { userID }, (err, pref) => {
                callback(err, pref);
            });
        });
    });
}

function sortPreferencesOrder(preferences, prefInOrder) {
    // Sort preferences first
    for (let type in preferences) {
        if (typeof (type) === "string") { prefInOrder.push([type, preferences[`${type}`]]); }
    }
    prefInOrder.sort(function (comp0, comp1) {
        return comp1[1] - comp0[1];
    });
    for (let i = 0; i < prefInOrder.length; i++) {
        prefInOrder[parseInt(i, 10)] = prefInOrder[parseInt(i, 10)][0];
    }
}

// Adjust order of tasks according to user preferences
function sortTasks(tasks, userID, callback) {
    // Read preferences from DB, iterate tasks per priority level, sort according to preference
    // Assign a number to preference, then order preferences with score for that type

    // Assuming tasks is an array of tasks, ordered by priority level

    // Task types available:
    //  - shopping
    //  - transport
    //  - setup
    //  - repair
    //  - study
    //  - work
    //  - fun
    getPreferences(userID, (err, results) => {
        let prefInOrder = [];
        let preferences = JSON.parse(results);

        sortPreferencesOrder(preferences, prefInOrder);

        // Order by preference for every priority level
        let sortedTasks = [];
        let iter = 0;
        while (iter < tasks.length) {
            let tempList = [];

            // Add all tasks with same priority level
            let currPriority = tasks[parseInt(iter, 10)].priorityLevel;
            while (iter < tasks.length && tasks[parseInt(iter, 10)].priorityLevel === currPriority) {
                tempList.push(tasks[parseInt(iter, 10)]);
                iter++;
            }

            // Sort tasks in tempList by preferences
            tempList.sort(function (comp0, comp1) {
                return prefInOrder.indexOf(comp0.taskType) -
                    prefInOrder.indexOf(comp1.taskType);
            });
            sortedTasks = sortedTasks.concat(tempList);
        }
        callback(err, sortedTasks);
    });
}

var recManager = {
    updatePreferences,
    sortTasks,
    getPreferences
};

module.exports = recManager;