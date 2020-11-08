const express = require('express');
const router = new express.Router();
const taskFunctions = require('../db/tasks_db');
const routerHelper = require('./routerHelper');

// Save created task onto database
router.post('/task/create', (req, res) => {
    // TODO:
    const task = req.body;

    if (typeof task.userID !== 'string' ||
        typeof task.taskListID !== 'string' ||
        typeof task.taskName !== 'string' ||
        typeof task.taskType !== 'string' ||
        typeof task.createdTime !== 'string' ||
        (typeof task.taskDescription !== 'string' && task.taskDescription !== null) ||
        (typeof task.budget !== 'number' && task.budget !== null) ||
        (typeof task.address !== 'string' && task.address !== null) ||
        (typeof task.priorityLevel !== 'number' && task.priorityLevel !== null) ||
        (typeof task.modifiedTime !== 'string' && task.modifiedTime !== null))
        res.status(400).send("bad data format or type");
    else {
        taskFunctions.createTask(task, (err, results, perms) => {
            if (!perms)
                res.status(401).send("user does not have permissions");
            routerHelper.callbackHandler(err, results);
        })
    }
})

// Update task
router.put('/task/update', (req, res) => {
    // TODO:
    const task = req.body;

    if (typeof task.userID !== 'string' ||
        typeof task.taskID !== 'string' ||
        typeof task.taskListID !== 'string' ||
        typeof task.taskName !== 'string' ||
        typeof task.taskType !== 'string' ||
        typeof task.createdTime !== 'string' ||
        (typeof task.taskDescription !== 'string' && task.taskDescription !== null) ||
        (typeof task.budget !== 'number' && task.budget !== null) ||
        (typeof task.address !== 'string' && task.address !== null) ||
        (typeof task.priorityLevel !== 'number' && task.priorityLevel !== null) ||
        (typeof task.modifiedTime !== 'string' && task.modifiedTime !== null))
        res.status(400).send("bad data format or type");
    else {
        taskFunctions.createTask(task, (err, results, perms) => {
            if (!perms)
                res.status(401).send("user does not have permissions");
            routerHelper.callbackHandler(err, results);
        });
    }
})

// Delete task
router.delete('/task/delete', (req, res) => {
    // TODO:
    const taskID = req.body.taskID;
    const userID = req.body.userID;
    const taskListID = req.body.taskListID;

    if (typeof task.userID !== 'string' ||
        typeof task.taskID !== 'string' ||
        typeof task.taskListID !== 'string')
        res.status(400).send("bad data format or type");
    else {
        taskFunctions.deleteTask(taskID, userID, taskListID, (err, results, perms) => {
            if (!perms)
                res.status(401).send("user does not have permissions");
            routerHelper.callbackHandler(err, results);
        });
    }
})

module.exports = router

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// OLD STUFF, NEED TO DELETE LATER
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// router.post('/task', auth, (req, res) => {
//     const task = req.body

//     // check if req.body.taskListID belongs to this user:
//     connection.query('SELECT * FROM HasAccess WHERE taskListID = ? AND userID = ?', [task.taskListID, req.user.userID], (err, taskList) => {
//         if (err || !result) return res.status(500).send('Cannot modify taskList because that\'s not belongs to you ')

//         connection.query('INSERT INTO TaskHasTaskList SET ?', task, (err, task) => {
//             if (err) return console.log(err)

//             res.status(201).send(task)
//         })
//     })

// })

// router.post('/task', auth, (req, res) => {
//     const task = req.body

//     // check if req.body.taskListID belongs to this user:
//     taskFunctions.checkAccess(task.taskListID, task.userID, (hasAccess) => {
//         if (!hasAccess) return res.status(500).send('Cannot modify taskList because that\'s not belongs to you ')

//         connection.query('INSERT INTO TaskHasTaskList SET ?', task, (err, task) => {
//             if (err) return console.log(err)

//             res.status(201).send(task)
//         })
//     })
// })

// question here: how to join different table using sql
// router.get('/task', auth, (req, res)=>{
//     connection.query('SELECT * FROM TaskListWithOwner WHERE userID = ?', req.user.userID, (err, taskList)=>{
//         if(err) return res.status(500).send(err)
//         console.log('Successfully get user information')
//         res.send(taskList)
//     })
// })


// router.get('/task', auth, (req, res) => {


//     connection.query('SELECT * FROM HasAccess WHERE taskListID = ? AND userID = ?', [req.body.taskListID, req.user.userID], (err, taskList) => {
//         if (err || !result) return res.status(500).send('Cannot modify taskList because that\'s not belongs to you ')

//         connection.query('SELECT * FROM TaskHasTaskList WHERE taskListID = ?', req.body.taskListID, (err, tasks) => {
//             if (err) return res.status(500).send(err)
//             console.log('Successfully get user information')
//             res.send(tasks)
//         })
//     })
// })


// // delete later
// router.get('/task/admin', (req, res) => {
//     connection.query('SELECT * FROM TaskHasTaskList', (err, tasks) => {
//         if (err) return res.status(500).send(err)
//         console.log('Successfully get user information')
//         res.send(tasks)
//     })
// })

// // delete later
// router.get('/task/:id', (req, res) => {
//     const _id = req.params.id
//     connection.query('SELECT * FROM TaskHasTaskList WHERE taskID = ?', _id, (err, task) => {
//         if (err || !result) return res.status(500).send(err)
//         console.log('Successfully specific user id information')
//         res.send(task)
//     })
// })


// // this is not fully functioned 
// router.put("/task/:id", auth, (req, res) => {

//     const _id = req.params.id
//     const obj = req.body

//     connection.query('UPDATE TaskHasTaskList SET ? WHERE taskID = ?', [obj, _id], (err, result) => {
//         if (err) {
//             console.log(err)
//             return res.send(err)
//         }
//         console.log('Successfully update user information')
//         res.send(result)
//     })
// })

// // this is not fully functioned
// router.delete('/task/:id', (req, res) => {
//     connection.query('DELETE FROM TaskHasTaskList WHERE taskID = ?', req.params.id, (err, result) => {
//         if (err) return res.status(500).send()

//         res.send('Successfully delete the task with id ' + req.params.id)
//     })
// })

// router.patch('/tasks/:id', async (req, res)=>{
    //     const updates = Object.keys(req)
    //     const allowedUpdates  = ['name', 'description', 'completed']
    //     const isValidOperation = updates.every((update)=>{
    //         return allowedUpdates.includes(update)
    //     })

    //     if(!isValidOperation) return res.status(400).send({error: 'Invalid updates!'})

    //     try {
    //         const task = await Task.findByIdAndUpdate(req.params.id, req.body, {new:true, runValidators:true})

    //         if(!task) return res.status(404).send()

    //         res.send(task)
    //     } catch(e) {
    //         res.status(400).send()
    //     }
    // })