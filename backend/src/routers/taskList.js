const express = require('express')
const router = new express.Router()
const taskListFunctions = require('../db/taskLists_db')
const userFunctions = require('../db/users_db')
const routerHelper = require('./routerHelper')


// Get all tasks (and its information) inside a task list
router.get('/tasklist/get/:userID/:taskListID', (req, res) => {
    const userID = req.params.userID;
    const taskListID = req.params.taskListID;

    console.log("getting all tasks for user with ID: " + userID + "from tasklist with ID: " + taskListID);

    if (typeof userID !== 'string' || typeof taskListID !== 'string')
        res.status(400).send("bad data format or type");
    else {
        userFunctions.checkPermission(userID, taskListID, (err, results) => {
            if (err)
                res.status(404).send(err);
            else if (!results)
                res.status(401).send("user does not have permission");
            else {
                taskListFunctions.getTasksInList(taskListID, (err, results) => {
                    routerHelper.callbackHandler(err, results);
                })
            }
        })
    }
})

// Save created task list onto database
router.post('/tasklist/create', (req, res) => {
    const newTaskList = req.body;

    if (typeof newTaskList.userID !== 'string' ||
        typeof newTaskList.taskListID !== 'string' ||
        typeof newTaskList.taskListName !== 'string' ||
        typeof newTaskList.createdTime !== 'string' ||
        (typeof newTaskList.modifiedTime !== 'string' && newTaskList.modifiedTime !== null) ||
        (typeof newTaskList.taskListDescription !== 'string' && newTaskList.taskListDescription !== null)) {
        res.status(400).send("bad data format or type");
    }
    else {
        taskListFunctions.createTaskList(newTaskList, (err, results) => {
            routerHelper.callbackHandler(err, results);
        })
    }
})

// Update a task list
router.put('/tasklist/update', (req, res) => {
    // TODO:
})

// Grant a user access to the task list + push notifications to users with access
router.post('/tasklist/adduser', (req, res) => {
    // TODO:
})

// Remove a user's access to the task list + push notifications to user with access
router.delete('tasklist/removeuser', (req, res) => {
    // TODO:
})

// Delete task list and sends push notification to all users with access
router.delete('tasklist/delete', (req, res) => {
    // TODO:
})


module.exports = router

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// OLD STUFF, NEED TO DELETE LATER
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// router.post('/taskList', (req, res) => {
//     const taskList = req.body
//     console.log("hellop")

//     connection.query('INSERT INTO TaskListWithOwner SET ?', taskList, (err, taskList) => {
//         if (err) return console.log(err)

//         const hasAccess = { userID: req.body.userID, taskListID: req.body.taskListID }
//         connection.query('INSERT INTO HasAccess SET ?', hasAccess, (err, result) => {
//             if (err) return console.log(err)

//             res.status(201).send(result)
//         })
//     })


// })

// router.get('/taskList', auth, (req, res) => {
//     connection.query('SELECT * FROM TaskListWithOwner WHERE userID = ?', req.user.userID, (err, taskList) => {
//         if (err) return res.status(500).send(err)
//         console.log('Successfully get user information')
//         res.send(taskList)
//     })
// })

// // delte this later
// router.get('/taskList/admin', (req, res) => {
//     connection.query('SELECT * FROM TaskListWithOwner', (err, taskList) => {
//         if (err) return res.status(500).send(err)
//         console.log('Successfully get user information')
//         res.send(taskList)
//     })
// })

// // delete this later
// router.get('/taskList/:id', (req, res) => {
//     const _id = req.params.id
//     connection.query('SELECT * FROM TaskListWithOwner WHERE taskListID = ?', _id, (err, taskList) => {
//         if (err || !result) return res.status(500).send(err)
//         console.log('Successfully specific user id information')
//         res.send(taskList)
//     })
// })

// router.put("/taskList/:id", auth, (req, res) => {

//     const _id = req.params.id
//     const obj = req.body

//     connection.query('SELECT * FROM HasAccess WHERE taskListID = ? AND userID = ?', [_id, req.user.userID], (err, hasAccess) => {
//         if (err || !result) return res.status(500).send('Cannot modify taskList because that\'s not belongs to you ')

//         connection.query('UPDATE TaskListWithOwner SET ? WHERE taskListID = ?', [obj, _id], (err, result) => {
//             if (err) {
//                 console.log(err)
//                 return res.send(err)
//             }
//             console.log('Successfully update user information')
//             res.send(result)
//         })

//     })


// })

// // change to only head user can delete later
// router.delete('/taskListsk/:id', auth, (req, res) => {

//     const _id = req.params.id

//     connection.query('SELECT * FROM HasAccess WHERE taskListID = ? AND userID = ?', [_id, req.user.userID], (err, taskList) => {
//         if (err || !result) return res.status(500).send('Cannot modify taskList because that\'s not belongs to you ')

//         connection.query('DELETE FROM TaskHasTaskList WHERE taskListID = ?', req.params.id, (err, result) => {
//             if (err) return res.status(500).send()

//             res.send('Successfully delete the taskList with id ' + req.params.id)
//         })
//     })

// })

